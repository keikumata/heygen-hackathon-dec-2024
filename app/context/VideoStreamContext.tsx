'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import InteractiveAvatar from '@/components/InteractiveAvatar';
import { Message } from '@/components/Chat';
import { useMessages } from './MessageContext';

interface VideoStreamContextType {
  VideoStreamComponent: React.FC<{ isMinimized: boolean }>;
  streamInstance: React.ReactNode | null;
  setStreamInstance: (instance: React.ReactNode) => void;
}

const VideoStreamContext = createContext<VideoStreamContextType | null>(null);

export function VideoStreamProvider({ children }: { children: ReactNode }) {
  const [streamInstance, setStreamInstance] = useState<React.ReactNode | null>(null);

  const VideoStreamComponent: React.FC<{ isMinimized: boolean }> = ({ isMinimized }) => {
    if (!streamInstance) {
      const instance = (
        <InteractiveAvatar 
          isMinimized={isMinimized}
        />
      );
      setStreamInstance(instance);
      return instance;
    }
    return streamInstance;
  };

  return (
    <VideoStreamContext.Provider value={{ 
      VideoStreamComponent, 
      streamInstance,
      setStreamInstance 
    }}>
      {children}
    </VideoStreamContext.Provider>
  );
}

export function useVideoStream() {
  const context = useContext(VideoStreamContext);
  if (!context) {
    throw new Error('useVideoStream must be used within a VideoStreamProvider');
  }
  return context;
}
