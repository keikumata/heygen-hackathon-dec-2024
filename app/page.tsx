'use client'

import { useState, useEffect } from 'react'
import { Logo } from '@/components/Logo'
import { ProductView } from '@/components/ProductView'
import { Chat } from '@/components/Chat'
import { useVideoStream } from '@/app/context/VideoStreamContext'
import { useMessages } from '@/app/context/MessageContext'
import StreamStartOverlay from '@/components/StreamStartOverlay'

const PRODUCTS = [
  { id: 'walking-pad', maxQuestions: 3 },
  { id: 'auto-foam-roller', maxQuestions: 3 }
]

export default function LiveShoppingPage() {
  const { VideoStreamComponent, setStreamInstance } = useVideoStream()
  const { messages, addMessage, clearMessages } = useMessages()
  const [hasStarted, setHasStarted] = useState(false)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const currentProduct = PRODUCTS[currentProductIndex]

  const streamProduct = async () => {
    const response = await fetch('/api/product-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId: currentProduct.id,
        type: 'stream'
      })
    });
    const { script } = await response.json();
    if (VideoStreamComponent) {
      await VideoStreamComponent.speak(script);
    }
  };

  useEffect(() => {
    if (hasStarted) {
      streamProduct();
    }
  }, [hasStarted, currentProductIndex]);

  useEffect(() => {
    if (questionCount >= currentProduct.maxQuestions && currentProductIndex < PRODUCTS.length - 1) {
      setCurrentProductIndex(prev => prev + 1);
      setQuestionCount(0);
      clearMessages();
    }
  }, [questionCount, currentProductIndex]);

  const handleNewMessage = (message: string) => {
    addMessage(message, true);
    setQuestionCount(prev => prev + 1);
  };

  const handleStart = () => {
    setHasStarted(true);
    setStreamInstance(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <Logo />
      </header>
      <main className="flex-grow flex md:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          <div className="w-full">
            {hasStarted ? (
              <VideoStreamComponent isMinimized={false} />
            ) : (
              <div className="h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg" />
            )}
          </div>
          <div className="flex-grow">
            <ProductView productId={currentProduct.id} />
          </div>
        </div>
        <Chat 
          className="w-full md:w-96 h-full"
          messages={messages}
          onNewMessage={handleNewMessage}
          disabled={!hasStarted || questionCount >= currentProduct.maxQuestions}
          remainingQuestions={currentProduct.maxQuestions - questionCount}
          productId={currentProduct.id}
        />
      </main>
      {!hasStarted && <StreamStartOverlay onStart={handleStart} />}
    </div>
  )
}