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
        <div className="flex-grow flex flex-col gap-4 max-h-full">
          <div className="w-full h-[500px]">
            {hasStarted ? (
              <VideoStreamComponent isMinimized={false} />
            ) : (
              <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg" />
            )}
          </div>
          <div className="h-[calc(100%-500px-1rem)] min-h-0">
            <ProductView />
          </div>
        </div>
        <Chat 
          className="w-full md:min-w-[320px] md:w-96 h-full" 
          messages={messages}
          onNewMessage={(message) => addMessage(message, true)}
          disabled={!hasStarted}
        />
      </main>
      <StreamStartOverlay onStart={handleStart} />
    </div>
  )
}

