'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import InteractiveAvatar from '@/components/InteractiveAvatar';
import { Message } from '@/components/Chat';
import { useMessages } from './MessageContext';

interface VideoStreamContextType {
  VideoStreamComponent: React.FC<{ isMinimized: boolean }>;
  streamInstance: React.ReactNode | null;
  setStreamInstance: (instance: React.ReactNode) => void;
<<<<<<< Updated upstream
=======
  currentProductId: string;
  setCurrentProductId: (id: string) => void;
  currentProduct: Product | null;
}

interface Product {
  id: string;
  name: string;
  introduction: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  details: Record<string, any>;
>>>>>>> Stashed changes
}

const VideoStreamContext = createContext<VideoStreamContextType | null>(null);

export function VideoStreamProvider({ children }: { children: ReactNode }) {
  const [streamInstance, setStreamInstance] = useState<React.ReactNode | null>(null);
<<<<<<< Updated upstream
=======
  const [currentProductId, setCurrentProductId] = useState('manduka-pro-mat');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Load products when context is initialized
  useState(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/knowledgeBase.json');
        const data = await response.json();
        setProducts(data.products);
        // Set initial product
        const initialProduct = data.products.find(
          (p: Product) => p.id === currentProductId
        );
        setCurrentProduct(initialProduct || null);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }
    loadProducts();
  }, []);

  // Update current product when ID changes
  useState(() => {
    const product = products.find(p => p.id === currentProductId);
    setCurrentProduct(product || null);
  }, [currentProductId, products]);
>>>>>>> Stashed changes

  const VideoStreamComponent: React.FC<{ isMinimized: boolean }> = ({ isMinimized }) => {
    if (!streamInstance) {
      const instance = (
<<<<<<< Updated upstream
        <InteractiveAvatar 
          isMinimized={isMinimized}
=======
        <InteractiveAvatar
          isMinimized={isMinimized}
          currentProductId={currentProductId}
          onProductChange={setCurrentProductId}
          productInfo={currentProduct}
>>>>>>> Stashed changes
        />
      );
      setStreamInstance(instance);
      return instance;
    }
    return streamInstance;
  };

  return (
<<<<<<< Updated upstream
    <VideoStreamContext.Provider value={{ 
      VideoStreamComponent, 
      streamInstance,
      setStreamInstance 
=======
    <VideoStreamContext.Provider value={{
      VideoStreamComponent,
      streamInstance,
      setStreamInstance,
      currentProductId,
      setCurrentProductId,
      currentProduct
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
