'use client'

import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { ProductView } from '@/components/ProductView'
import { Chat } from '@/components/Chat'
import { useVideoStream } from '@/app/context/VideoStreamContext'
import { useMessages } from '@/app/context/MessageContext'
import StreamStartOverlay from '@/components/StreamStartOverlay'

export default function LiveShoppingPage() {
  const { VideoStreamComponent, setStreamInstance } = useVideoStream()
  const { messages, addMessage } = useMessages()
  const [hasStarted, setHasStarted] = useState(false)
  
  const handleStart = () => {
    setHasStarted(true);
    // This will trigger a re-render of VideoStreamComponent with initialization
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
            <ProductView />
          </div>
        </div>
        <Chat 
          className="w-full md:w-96 h-full" 
          messages={messages}
          onNewMessage={(message) => addMessage(message, true)}
          disabled={!hasStarted}
        />
      </main>
      <StreamStartOverlay onStart={handleStart} />
    </div>
  )
}

