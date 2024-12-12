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

interface Product {
  id: number;
  name: string;
  intro: string;
  speech: string;
}

export default function InteractiveAvatar({ isMinimized = false }: InteractiveAvatarProps) {
  const { messages } = useMessages();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string>();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const hasInitialized = useRef(false);
  const hasPlayedIntro = useRef(false);
  const [questionsAsked, setQuestionsAsked] = useState<number>(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [isInIntroPhase, setIsInIntroPhase] = useState(true);
  const [pendingProductIntro, setPendingProductIntro] = useState(false);
  const isInIntroPhaseRef = useRef(true);
  const pendingProductIntroRef = useRef(false);
  const currentProductIndexRef = useRef(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/get-products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      }
    }
    fetchProducts();
  }, []);

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

  async function generateResponse(message: string, isIntroduction = false, productId?: number) {
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: messages,
          isIntroduction,
          productId
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
    hasPlayedIntro.current = false;
  }

  async function introduceProduct() {
    if (!avatar.current) return;
    
    try {
      if (!hasIntroduced) {
        isInIntroPhaseRef.current = true;
        pendingProductIntroRef.current = true;
        const introResponse = await generateResponse("Introduce yourself", true);
        setHasIntroduced(true);
        await avatar.current.speak({
          text: introResponse,
          taskType: TaskType.REPEAT,
          taskMode: TaskMode.SYNC
        });
      }
    } catch (error) {
      console.error("Error introducing:", error);
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
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    
    avatar.current.on(StreamingEvents.STREAM_READY, async(event) => {
      setStream(event.detail);
      
      if (!hasPlayedIntro.current) {
        console.log("Stream and start intro");
        await introduceProduct();
        hasPlayedIntro.current = true;
      }
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: "fa7b34fe0b294f02b2fca6c1ed2c7158",
        voice: {
          rate: 1.2,
          emotion: VoiceEmotion.EXCITED,
        },
        language: 'en',
        disableIdleTimeout: true,
      })
    } catch (error: any) {
      console.error("Error starting avatar session:", error);
      setError(error.message || "Failed to initialize avatar");
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function handleMessage(message: string) {
    if (!avatar.current || hasFinished || products.length === 0) {
      setDebug("Avatar API not initialized, session finished, or no products loaded");
      return;
    }

    setIsGeneratingResponse(true);
    try {
      const currentProduct = products[currentProductIndexRef.current];
      const response = await generateResponse(message, false, currentProduct.id);
      await avatar.current.speak({
        text: response,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC
      });

      const newQuestionsCount = questionsAsked + 1;
      setQuestionsAsked(newQuestionsCount);

      if (newQuestionsCount === 3) {
        if (currentProductIndexRef.current < products.length - 1) {
          setQuestionsAsked(0);
          currentProductIndexRef.current = currentProductIndexRef.current + 1;
          setCurrentProductIndex(currentProductIndexRef.current);
          isInIntroPhaseRef.current = true;
          const nextProduct = products[currentProductIndexRef.current];
          const productIntro = await generateResponse("Introduce the product", true, nextProduct.id);
          await avatar.current.speak({
            text: productIntro,
            taskType: TaskType.REPEAT,
            taskMode: TaskMode.SYNC
          });
          isInIntroPhaseRef.current = false;
        } else {
          setHasFinished(true);
        }
      }
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
      console.log("lastMessage", lastMessage);
      handleMessage(lastMessage.content);
    }
  }, [messages, hasIntroduced]);

  useEffect(() => {
    const initAndStart = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      
      await initializeAudioContext();
      await startSession();
    };
    
    initAndStart();
  }, []); // Run once on mount

  useEffect(() => {
    if (avatar.current && products.length > 0) {
      // Remove any existing handler first
      avatar.current.off(StreamingEvents.AVATAR_STOP_TALKING, () => {});
      
      // Add new handler with access to current products
      avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, async (e) => {
        console.log("Avatar stopped talking", e, isInIntroPhaseRef.current, pendingProductIntroRef.current);
        
        if (isInIntroPhaseRef.current && pendingProductIntroRef.current) {
          pendingProductIntroRef.current = false;
          isInIntroPhaseRef.current = false;
          
          console.log("currentProductIndex", currentProductIndexRef.current, products);
          const productIntro = await generateResponse("Introduce the product", true, products[currentProductIndexRef.current].id);
          await avatar.current?.speak({
            text: productIntro,
            taskType: TaskType.REPEAT,
            taskMode: TaskMode.SYNC
          });
        }
      });
    }
  }, [products, avatar.current]);

  return (
    <div className={cn(
      "w-full flex flex-col gap-4 h-full justify-center items-center",
      isMinimized && "h-full"
    )}>
      <div className={cn(
        isMinimized ? "h-full" : "h-[500px]",
        "relative w-full flex justify-center items-center"
      )}>
        {isLoadingSession ? (
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
