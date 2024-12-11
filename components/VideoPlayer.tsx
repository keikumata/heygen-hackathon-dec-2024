import { FC } from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface VideoPlayerProps {
  className?: string
}

const VideoPlayer: FC<VideoPlayerProps> = ({ className }) => {
  return (
    <Card className={`${className} overflow-hidden`}>
      <CardContent className="p-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/placeholder-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </CardContent>
    </Card>
  )
}

export default VideoPlayer

