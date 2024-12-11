'use client'

import { useState, useEffect } from 'react'
import { Logo } from '@/components/Logo'
import { ProductView } from '@/components/ProductView'
import { Chat } from '@/components/Chat'
import { useVideoStream } from '@/app/context/VideoStreamContext'
import { useMessages } from '@/app/context/MessageContext'

interface Product {
  id: string;
  name: string;
  introduction: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
}

export default function LiveShoppingPage() {
  const { VideoStreamComponent, currentProductId, setCurrentProductId } = useVideoStream()
  const { messages, addMessage } = useMessages()
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/knowledgeBase.json')
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    
    loadProducts()
  }, [])

  const handleProductChange = (productId: string) => {
    setCurrentProductId(productId)
  }

  const handleNewMessage = (message: string) => {
    addMessage(message, true)
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <Logo />
      </header>
      <main className="flex-grow flex md:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          <div className="w-full">
            <VideoStreamComponent 
              isMinimized={false}
              onProductChange={handleProductChange}
            />
          </div>
          <div className="flex-grow">
            <ProductView 
              currentProductId={currentProductId}
            />
          </div>
        </div>
        <Chat 
          className="w-full md:w-96 h-full" 
          messages={messages}
          onNewMessage={handleNewMessage}
          disabled={false}
          currentProductId={currentProductId}
        />
      </main>
    </div>
  )
}