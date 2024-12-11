'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { Message } from '@/components/Chat';

interface MessageContextType {
  messages: Message[];
  addMessage: (message: string, isUser?: boolean) => void;
  setMessages: (messages: Message[]) => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (content: string, isUser: boolean = true) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username: isUser ? "User" : "Avatar",
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      addMessage,
      setMessages 
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
} 