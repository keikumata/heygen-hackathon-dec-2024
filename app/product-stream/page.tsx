"use client";
import React, { useEffect, useRef, useState } from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  StartAvatarResponse
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  Input,
  Spinner,
  ScrollShadow,
} from "@nextui-org/react";

interface ChatMessage {
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
}

interface PresetAnswer {
  [key: string]: string;
}

const PRESET_ANSWERS: PresetAnswer = {
  "price": "The product costs $99.99 with free shipping.",
  "warranty": "We offer a 2-year warranty on this product.",
  "shipping": "We ship worldwide within 3-5 business days.",
  "return": "Our return policy allows returns within 30 days.",
  "material": "This product is made from premium quality materials.",
};

const ProductStream: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [data, setData] = useState<StartAvatarResponse>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  async function fetchAccessToken(): Promise<string> {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      return await response.text();
    } catch (error) {
      console.error("Error fetching token:", error);
      return "";
    }
  }

  async function startProductDemo(): Promise<void> {
    setIsLoading(true);
    const token = await fetchAccessToken();

    avatar.current = new StreamingAvatar({ token });

    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      setStream(event.detail);
    });

    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      setStream(null);
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: "your_avatar_id", // Replace with your avatar ID
        knowledgeId: "your_knowledge_base_id", // Replace with your knowledge base ID
        voice: {
          rate: 1.2,
        },
        disableIdleTimeout: true,
      });

      setData(res);

      // Initial product introduction
      await avatar.current.speak({
        text: "Welcome! Let me tell you about this amazing product. Feel free to ask any questions about price, warranty, shipping, or other features.",
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC
      });
    } catch (error) {
      console.error("Error starting avatar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChatMessage(): Promise<void> {
    if (!inputMessage.trim() || !avatar.current) return;

    const newMessage: ChatMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);

    const matchingAnswer = findMatchingAnswer(inputMessage);
    
    const avatarResponse: ChatMessage = {
      type: 'avatar',
      content: matchingAnswer,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, avatarResponse]);

    try {
      await avatar.current.speak({
        text: matchingAnswer,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC
      });
    } catch (error) {
      console.error("Error in avatar speech:", error);
    }

    setInputMessage("");
  }

  function findMatchingAnswer(question: string): string {
    const lowercaseQuestion = question.toLowerCase();
    for (const [key, answer] of Object.entries(PRESET_ANSWERS)) {
      if (lowercaseQuestion.includes(key)) {
        return answer;
      }
    }
    return "I'm sorry, I don't have information about that specific question. Feel free to ask about price, warranty, shipping, or materials.";
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current?.play();
      };
    }
  }, [stream]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      avatar.current?.stopAvatar();
    };
  }, []);

  return (
    <div className="flex gap-4 p-4 h-[800px]">
      <div className="w-2/3">
        <Card className="h-full">
          {stream ? (
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="h-full flex items-center justify-center">
              {isLoading ? (
                <Spinner size="lg" />
              ) : (
                <Button
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                  size="lg"
                  onClick={startProductDemo}
                >
                  Start Product Demo
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="w-1/3">
        <Card className="h-full flex flex-col">
          <ScrollShadow ref={chatContainerRef} className="flex-grow p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-100 ml-8'
                    : 'bg-gray-100 mr-8'
                }`}
              >
                <p className="text-sm">
                  {message.content}
                </p>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </ScrollShadow>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about the product..."
                onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                disabled={!stream}
              />
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                onClick={handleChatMessage}
                disabled={!stream}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductStream;