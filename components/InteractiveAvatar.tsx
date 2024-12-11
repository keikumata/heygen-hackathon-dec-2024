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
import { cn } from "@/lib/utils";
import { useMessages } from "@/app/context/MessageContext";

interface InteractiveAvatarProps {
  isMinimized?: boolean;
}

export default function InteractiveAvatar({ isMinimized = false }: InteractiveAvatarProps) {
  const { messages } = useMessages();
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string>();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [hasIntroduced, setHasIntroduced] = useState(false);

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

  async function generateResponse(message: string, isIntroduction = false) {
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: messages,
          isIntroduction
        }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'I apologize, but I am having trouble generating a response right now.';
    }
  }

  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function introduceProduct() {
    if (!avatar.current) return;
    
    try {
      const introResponse = await generateResponse("Introduce the product", true);
      await avatar.current.speak({
        text: introResponse,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC
      });
      setHasIntroduced(true);
    } catch (error) {
      console.error("Error introducing product:", error);
    }
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
    
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      console.log("Stream ready:", event.detail);
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

      if (!res.stream) {
        throw new Error("No stream received from avatar creation");
      }
      
      setStream(res.stream);
      await introduceProduct();
    } catch (error: any) {
      console.error("Error starting avatar session:", error);
      setError(error.message || "Failed to initialize avatar");
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function handleMessage(message: string) {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }

    setIsGeneratingResponse(true);
    console.log("Generating response for message:", message);
    try {
      const response = await generateResponse(message, false);
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
    console.log("messages", messages);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.username === "User" && hasIntroduced) {
      handleMessage(lastMessage.content);
    }
  }, [messages, hasIntroduced]);

  return (
    <div className={cn(
      "w-full flex flex-col gap-4",
      isMinimized && "h-full"
    )}>
      <div className={cn(
        isMinimized ? "h-full" : "h-[500px]",
        "relative"
      )}>
        {!isInitialized ? (
          <Card className="h-full">
            <CardBody className="flex flex-col justify-center items-center p-4">
              <Button 
                onClick={async () => {
                  await initializeAudioContext();
                  startSession();
                }}
              >
                Start Avatar Session
              </Button>
            </CardBody>
          </Card>
        ) : isLoadingSession ? (
          <Card className="h-full">
            <CardBody className="flex flex-col justify-center items-center p-4">
              <Spinner color="default" size="lg" />
            </CardBody>
          </Card>
        ) : stream ? (
          <div className={cn(
            "justify-center items-center flex rounded-lg overflow-hidden",
            isMinimized ? "w-full h-full" : "h-[500px] w-[900px]"
          )}>
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: isMinimized ? "cover" : "contain",
              }}
            >
              <track kind="captions" />
            </video>
          </div>
        ) : (
          <Card className="h-full">
            <CardBody className="flex flex-col justify-center items-center p-4">
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
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
