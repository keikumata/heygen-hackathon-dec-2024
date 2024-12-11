'use client'

import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Card, CardBody, Spinner, Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/app/context/MessageContext";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  introduction: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  details: Record<string, any>;
}

interface InteractiveAvatarProps {
  isMinimized: boolean;
  currentProductId: string;
  onProductChange: (productId: string) => void;
  productInfo: Product | null;
}

export default function InteractiveAvatar({ 
  isMinimized = false,
  currentProductId,
  onProductChange,
  productInfo
}: InteractiveAvatarProps) {
  const { messages, addMessage } = useMessages();
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
      return await response.text();
    } catch (error) {
      console.error("Error fetching access token:", error);
      return "";
    }
  }

  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function introduceProduct() {
    if (!avatar.current || !productInfo) return;
    
    try {
      await avatar.current.speak({
        text: productInfo.introduction,
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
    const token = await fetchAccessToken();
    avatar.current = new StreamingAvatar({ token });
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    
    avatar.current.on(StreamingEvents.STREAM_READY, async(event) => {
      setStream(event.detail);
      await introduceProduct();
    });

    try {
      await avatar.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: "fa7b34fe0b294f02b2fca6c1ed2c7158",
        voice: {
          rate: 1.2,
          emotion: VoiceEmotion.EXCITED,
        },
        language: 'en',
        disableIdleTimeout: true,
      });
    } catch (error: any) {
      console.error("Error starting avatar session:", error);
      setError(error.message || "Failed to initialize avatar");
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function handleMessage(message: string) {
    if (!avatar.current || !productInfo) {
      setDebug("Avatar or product info not initialized");
      return;
    }

    setIsGeneratingResponse(true);
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: messages.filter(m => m.productId === currentProductId),
          productId: currentProductId
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        const maxQuestionsMessage = "I've answered the maximum number of questions for this product. Let's check out another great item!";
        await avatar.current.speak({
          text: maxQuestionsMessage,
          taskType: TaskType.REPEAT,
          taskMode: TaskMode.SYNC
        });
        addMessage(maxQuestionsMessage, false, currentProductId);
        return;
      }

      await avatar.current.speak({
        text: data.response,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC
      });
      
      addMessage(data.response, false, currentProductId);
    } catch (e: any) {
      setDebug(e.message);
    } finally {
      setIsGeneratingResponse(false);
    }
  }

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
      };
    }
  }, [stream]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.username === "User" && 
        lastMessage?.productId === currentProductId && 
        hasIntroduced) {
      handleMessage(lastMessage.content);
    }
  }, [messages, hasIntroduced, currentProductId]);

  useEffect(() => {
    setHasIntroduced(false);
    if (stream && productInfo) {
      introduceProduct();
    }
  }, [currentProductId, productInfo]);

  return (
    <div className={cn(
      "w-full flex flex-col gap-4 h-full justify-center items-center",
      isMinimized && "h-full"
    )}>
      <div className={cn(
        isMinimized ? "h-full" : "h-[500px]",
        "relative w-full flex justify-center items-center"
      )}>
        {!isInitialized ? (
          <Card className="h-full w-full max-w-[900px]">
            <CardBody className="flex flex-col justify-center items-center p-4">
              <Button onClick={async () => {
                await initializeAudioContext();
                startSession();
              }}>
                Start Avatar Session
              </Button>
            </CardBody>
          </Card>
        ) : isLoadingSession ? (
          <Card className="h-full w-full max-w-[900px]">
            <CardBody className="flex flex-col justify-center items-center p-4">
              <Spinner color="default" size="lg" />
            </CardBody>
          </Card>
        ) : stream ? (
          <div className={cn(
            "justify-center items-center flex rounded-lg overflow-hidden relative",
            isMinimized ? "w-full h-full" : "h-[500px] w-[900px]"
          )}>
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                objectFit: isMinimized ? "cover" : "contain",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <track kind="captions" />
            </video>
          </div>
        ) : (
          <Card className="h-full w-full max-w-[900px]">
            <CardBody className="flex flex-col justify-center items-center p-4">
              <div className="flex flex-col items-center gap-2">
                <div>Failed to load avatar</div>
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Button onClick={() => {
                  setError(undefined);
                  startSession();
                }}>
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