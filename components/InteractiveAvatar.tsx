import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import {
  Card,
  CardBody,
  Divider,
  Spinner,
  Button,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Message } from "./Chat";

interface InteractiveAvatarProps {
  messages: Message[];
}

export default function InteractiveAvatar({ messages }: InteractiveAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string>();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      console.log("Access token received:", token.substring(0, 10) + "...");
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
    return "";
  }


  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function startSession() {
    if (!isInitialized) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      await audioContext.resume();
      setIsInitialized(true);
    }

    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log(">>>>> Stream ready:", event.detail);
      setStream(event.detail);
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: "Anna_public_3_20240108",
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.EXCITED,
        },
        language: 'en',
        disableIdleTimeout: true,
      });

      console.log(res)

      if (!res.stream) {
        throw new Error("No stream received from avatar creation");
      }
      
      setStream(res.stream);
    } catch (error: any) {
      console.error("Error starting avatar session:", error);
      setError(error.message || "Failed to initialize avatar");
      setIsLoadingSession(false);
    }
  }

  async function generateResponse(message: string) {
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: messages
        }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'I apologize, but I am having trouble generating a response right now.';
    }
  }

  async function handleMessage(message: string) {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }

    setIsGeneratingResponse(true);
    try {
      const response = await generateResponse(message);
      
      await avatar.current.speak({ 
        text: response,
        taskType: TaskType.REPEAT, 
        taskMode: TaskMode.SYNC 
      });
    } catch (e: any) {
      setDebug(e.message);
    } finally {
      setIsGeneratingResponse(false);
    }
  }

  const initializeAudioContext = async () => {
    if (!isInitialized) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      await audioContext.resume();
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    return () => {
      avatar.current?.stopAvatar();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [stream]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.username === "User") {
      handleMessage(lastMessage.content);
    }
  }, [messages]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardBody className="h-[500px] flex flex-col justify-center items-center">
          {!isInitialized ? (
            <Button 
              onClick={async () => {
                await initializeAudioContext();
                startSession();
              }}
            >
              Start Avatar Session
            </Button>
          ) : isLoadingSession ? (
            <Spinner color="default" size="lg" />
          ) : stream ? (
            <div className="h-[500px] w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <track kind="captions" />
              </video>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div>Failed to load avatar</div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button 
                onClick={() => {
                  setError(undefined);
                  startSession();
                }}
              >
                Retry
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
