'use client'

import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { ProductView } from '@/components/ProductView'
import { Chat } from '@/components/Chat'
import { useVideoStream } from '@/app/context/VideoStreamContext'
import { useMessages } from '@/app/context/MessageContext'

export default function LiveShoppingPage() {
  const { VideoStreamComponent } = useVideoStream()
  const { messages, addMessage } = useMessages()
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <Logo />
      </header>
      <main className="flex-grow flex md:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          <div className="w-full">
            <VideoStreamComponent isMinimized={false} />
          </div>
          <div className="flex-grow">
            <ProductView />
          </div>
        </div>
        <Chat 
          className="w-full md:w-96 h-full" 
          messages={messages}
          onNewMessage={(message) => addMessage(message, true)}
          disabled={false}
        />
      </main>
    </div>
  )
}

