'use client'

<<<<<<< Updated upstream
import { useState } from 'react'
=======
<<<<<<< Updated upstream
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
=======
import { useState, useEffect } from 'react'
>>>>>>> Stashed changes
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const { VideoStreamComponent } = useVideoStream()
  const { messages, addMessage } = useMessages()
=======
<<<<<<< Updated upstream
  const [isProductView, setIsProductView] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 })
  const isDragging = useRef(false)
=======
  const { VideoStreamComponent, currentProductId, setCurrentProductId } = useVideoStream()
  const { messages, addMessage } = useMessages()
  const [products, setProducts] = useState<Product[]>([])
  
  // Load products data
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

  // Handle product switching when host changes product
  const handleProductChange = (productId: string) => {
    setCurrentProductId(productId)
  }

  // Handle new chat messages
  const handleNewMessage = (message: string) => {
    addMessage(message, true)
  }
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <Logo />
      </header>
<<<<<<< Updated upstream
      <main className="flex-grow flex md:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          <div className="w-full">
            <VideoStreamComponent isMinimized={false} />
          </div>
          <div className="flex-grow">
            <ProductView />
          </div>
=======
<<<<<<< Updated upstream
      <main className="flex-grow flex md:flex-row relative overflow-hidden">
        <div 
          className="flex-grow relative overflow-hidden" 
          id="stream-container" 
          ref={containerRef}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key="stream"
              initial={{ scale: isProductView ? 1 : 0.3, x: isProductView ? '70%' : 0, y: isProductView ? '70%' : 0 }}
              animate={{ scale: isProductView ? 0.3 : 1, x: isProductView ? '70%' : 0, y: isProductView ? '70%' : 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="absolute inset-0"
            >
              {videoStream}
            </motion.div>
            <motion.div
              key="product"
              initial={{ scale: !isProductView ? 0.3 : 1, x: !isProductView ? '70%' : 0, y: !isProductView ? '70%' : 0 }}
              animate={{ scale: !isProductView ? 0.3 : 1, x: !isProductView ? '70%' : 0, y: !isProductView ? '70%' : 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="absolute inset-0"
            >
              <ProductView />
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="absolute w-32 h-32 bg-background/80 backdrop-blur rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
            initial={{ right: 16, bottom: 16 }}
            style={{
              right: isProductView ? '1rem' : undefined,
              bottom: isProductView ? '1rem' : undefined,
              top: isProductView ? undefined : 'auto',
              left: isProductView ? undefined : 'auto'
            }}
            whileHover={{ scale: 1.05 }}
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => {
              isDragging.current = true
            }}
            onDragEnd={() => {
              setTimeout(() => {
                isDragging.current = false
              }, 100)
            }}
            onClick={() => {
              if (!isDragging.current) {
                setIsProductView(!isProductView)
              }
            }}
          >
            {isProductView ? (
              videoStream
            ) : (
              <Image
                src="/product.png"
                alt="Product preview"
                fill
                className="object-cover pointer-events-none"
              />
            )}
          </motion.div>
=======
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        </div>
        <Chat 
          className="w-full md:w-96 h-full" 
          messages={messages}
<<<<<<< Updated upstream
          onNewMessage={(message) => addMessage(message, true)}
=======
<<<<<<< Updated upstream
          setMessages={setMessages}
=======
>>>>>>> Stashed changes
          onNewMessage={handleNewMessage}
>>>>>>> Stashed changes
          disabled={false}
          currentProductId={currentProductId} // Pass to Chat for product-specific responses
        />
      </main>
    </div>
  )
}