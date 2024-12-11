'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"

export function VideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Only set up the video once
    if (!video.src) {
      video.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      video.load()
    }

    // Handle play/pause to maintain state
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented, handle if needed
      })
    }

    return () => {
      // Don't stop the video on cleanup, just pause if needed
      if (!document.hidden) {
        video.pause()
      }
    }
  }, [])

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardContent className="p-0 h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </CardContent>
    </Card>
  )
}

