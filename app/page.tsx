'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { VideoStream } from '@/components/VideoStream'
import { ProductView } from '@/components/ProductView'
import { Chat } from '@/components/Chat'
import Image from 'next/image'

export default function LiveShoppingPage() {
  const [isProductView, setIsProductView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 })
  const isDragging = useRef(false)
  const videoStream = <VideoStream />

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        setDragConstraints({
          top: 0,
          left: 0,
          right: containerRef.current.clientWidth - 128,
          bottom: containerRef.current.clientHeight - 128,
        })
      }
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <Logo />
      </header>
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
        </div>
        <Chat className="w-full md:w-96 h-[30vh] md:h-full" />
      </main>
    </div>
  )
}

