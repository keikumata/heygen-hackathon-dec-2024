'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
<<<<<<< Updated upstream
import { Message } from '@/components/Chat';

interface MessageContextType {
  messages: Message[];
  addMessage: (message: string, isUser?: boolean) => void;
  setMessages: (messages: Message[]) => void;
=======

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
>>>>>>> Stashed changes
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

<<<<<<< Updated upstream
  const addMessage = (content: string, isUser: boolean = true) => {
=======
  const addMessage = (content: string, isUser: boolean = true, productId?: string) => {
>>>>>>> Stashed changes
    const newMessage: Message = {
      id: Date.now().toString(),
      username: isUser ? "User" : "Avatar",
      content,
<<<<<<< Updated upstream
      timestamp: new Date()
=======
      timestamp: new Date(),
      productId
>>>>>>> Stashed changes
    };
    setMessages(prev => [...prev, newMessage]);
  };

<<<<<<< Updated upstream
=======
  const getProductMessages = (productId: string) => {
    return messages.filter(message => message.productId === productId);
  };

  const clearProductMessages = (productId: string) => {
    setMessages(prev => prev.filter(message => message.productId !== productId));
  };

>>>>>>> Stashed changes
  return (
    <MessageContext.Provider value={{ 
      messages, 
      addMessage,
<<<<<<< Updated upstream
      setMessages 
=======
      setMessages,
      getProductMessages,
      clearProductMessages
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
} 
=======
}
>>>>>>> Stashed changes
