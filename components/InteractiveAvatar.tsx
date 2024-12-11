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
  Spinner,
  Button,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
<<<<<<< Updated upstream
import { Message } from "./Chat";
import { cn } from "@/lib/utils";
import { useMessages } from "@/app/context/MessageContext";

interface InteractiveAvatarProps {
  isMinimized?: boolean;
}

<<<<<<< Updated upstream
export default function InteractiveAvatar({ isMinimized = false }: InteractiveAvatarProps) {
  const { messages } = useMessages();
=======
export default function InteractiveAvatar({ messages }: InteractiveAvatarProps) {
=======
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function introduceProduct() {
<<<<<<< Updated upstream
    if (!avatar.current) return;
    
    try {
      const introResponse = await generateResponse("Introduce the product", true);
      await avatar.current.speak({
        text: introResponse,
=======
    if (!avatar.current || !productInfo) return;
    
    try {
      await avatar.current.speak({
        text: productInfo.introduction,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
=======
    avatar.current = new StreamingAvatar({ token });
>>>>>>> Stashed changes
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    
<<<<<<< Updated upstream
    avatar.current.on(StreamingEvents.STREAM_READY, async(event) => {
      console.log("Stream ready:", event.detail);
=======
<<<<<<< Updated upstream
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      console.log("Stream ready:", event.detail);
=======
    avatar.current.on(StreamingEvents.STREAM_READY, async(event) => {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      setStream(event.detail);
      await introduceProduct();
    });

    try {
<<<<<<< Updated upstream
      const res = await avatar.current.createStartAvatar({
<<<<<<< Updated upstream
        quality: AvatarQuality.Medium,
        avatarName: "fa7b34fe0b294f02b2fca6c1ed2c7158",
=======
        quality: AvatarQuality.Low,
        avatarName: "Anna_public_3_20240108",
=======
      await avatar.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: "fa7b34fe0b294f02b2fca6c1ed2c7158",
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        voice: {
          rate: 1.2,
          emotion: VoiceEmotion.EXCITED,
        },
        language: 'en',
        disableIdleTimeout: true,
<<<<<<< Updated upstream
      })
=======
      });
<<<<<<< Updated upstream

      if (!res.stream) {
        throw new Error("No stream received from avatar creation");
      }
      
      setStream(res.stream);
      await introduceProduct();
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    } catch (error: any) {
      console.error("Error starting avatar session:", error);
      setError(error.message || "Failed to initialize avatar");
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function handleMessage(message: string) {
<<<<<<< Updated upstream
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
=======
    if (!avatar.current || !productInfo) {
      setDebug("Avatar or product info not initialized");
>>>>>>> Stashed changes
      return;
    }

    setIsGeneratingResponse(true);
<<<<<<< Updated upstream
    console.log("Generating response for message:", message);
    try {
      const response = await generateResponse(message, false);
      await avatar.current.speak({
        text: response,
=======
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
>>>>>>> Stashed changes
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
    console.log("messages", messages);
    const lastMessage = messages[messages.length - 1];
<<<<<<< Updated upstream
    if (lastMessage && lastMessage.username === "User" && hasIntroduced) {
      handleMessage(lastMessage.content);
    }
  }, [messages, hasIntroduced]);

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
=======
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
<<<<<<< Updated upstream
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
>>>>>>> Stashed changes
              <Button 
                onClick={async () => {
                  await initializeAudioContext();
                  startSession();
                }}
              >
                Start Avatar Session
              </Button>
<<<<<<< Updated upstream
=======
            </div>
          )}
        </CardBody>
      </Card>
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <Button 
                  onClick={() => {
                    setError(undefined);
                    startSession();
                  }}
                >
=======
                <Button onClick={() => {
                  setError(undefined);
                  startSession();
                }}>
>>>>>>> Stashed changes
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    </div>
  );
}