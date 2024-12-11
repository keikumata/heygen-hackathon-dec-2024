'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import InteractiveAvatar from '@/components/InteractiveAvatar';

interface VideoStreamContextType {
  VideoStreamComponent: React.FC<{ isMinimized: boolean }>;
  streamInstance: React.ReactNode | null;
  setStreamInstance: (instance: React.ReactNode) => void;
  streamProduct: (productId: string) => Promise<void>;
}

const VideoStreamContext = createContext<VideoStreamContextType | null>(null);

export function VideoStreamProvider({ children }: { children: ReactNode }) {
  const [streamInstance, setStreamInstance] = useState<React.ReactNode | null>(null);
  const [avatarComponent, setAvatarComponent] = useState<any>(null);

  const streamProduct = async (productId: string) => {
    if (avatarComponent?.current) {
      const response = await fetch('/api/product-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const { script } = await response.json();
      await avatarComponent.current.speak({ text: script });
    }
  };

  const VideoStreamComponent: React.FC<{ isMinimized: boolean }> = ({ isMinimized }) => {
    if (!streamInstance) {
      const instance = <InteractiveAvatar ref={setAvatarComponent} isMinimized={isMinimized} />;
      setStreamInstance(instance);
      return instance;
    }
    return streamInstance;
  };

  return (
    <VideoStreamContext.Provider value={{ 
      VideoStreamComponent,
      streamInstance,
      setStreamInstance,
      streamProduct
    }}>
      {children}
    </VideoStreamContext.Provider>
  );
}

export function useVideoStream() {
  const context = useContext(VideoStreamContext);
  if (!context) throw new Error('useVideoStream must be used within a VideoStreamProvider');
  return context;
}
