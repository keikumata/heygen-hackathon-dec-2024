'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  productId?: string;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: string, isUser: boolean, productId?: string) => void;
  setMessages: (messages: Message[]) => void;
  getProductMessages: (productId: string) => Message[];
  clearProductMessages: (productId: string) => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (content: string, isUser: boolean = true, productId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username: isUser ? "User" : "Avatar",
      content,
      timestamp: new Date(),
      productId
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getProductMessages = (productId: string) => {
    return messages.filter(message => message.productId === productId);
  };

  const clearProductMessages = (productId: string) => {
    setMessages(prev => prev.filter(message => message.productId !== productId));
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      addMessage,
      setMessages,
      getProductMessages,
      clearProductMessages
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
