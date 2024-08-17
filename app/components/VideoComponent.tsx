import { useState, useEffect } from 'react'

const VideoComponent: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    const calculateVideoDimensions = () => {
      const video = document.createElement('video')
      video.src = videoUrl

      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight
        const screenWidth = window.innerWidth
        let dynamicWidth, dynamicHeight

        if (aspectRatio > 1) {
          // Video horizontal (16:9)
          if (screenWidth < 640) {
            dynamicWidth = screenWidth
          } else if (screenWidth < 960) {
            dynamicWidth = screenWidth * 0.45
          } else {
            dynamicWidth = screenWidth * 0.5
          }
          dynamicHeight = dynamicWidth / aspectRatio
        } else {
          if (screenWidth < 640) {
            dynamicWidth = screenWidth
          } else if (screenWidth < 780) {
            dynamicWidth = 270
          } else if (screenWidth < 960) {
            dynamicWidth = 300
          } else {
            dynamicWidth = Math.min(screenWidth * 0.8, 400)
          }
          dynamicHeight = dynamicWidth / aspectRatio
        }

        setVideoDimensions({
          width: dynamicWidth,
          height: dynamicHeight,
        })
      }
    }

    calculateVideoDimensions()

    const handleResize = () => {
      calculateVideoDimensions()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [videoUrl])

  return (
    <div>
      {videoDimensions ? (
        <video
          src={videoUrl}
          width={videoDimensions.width}
          height={videoDimensions.height}
          controls
          autoPlay
          loop
          className="xs:rounded-3xl w-full sm:w-auto sm:h-full object-cover"
        />
      ) : (
        <div className="w-full flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  )
}

export default VideoComponent
