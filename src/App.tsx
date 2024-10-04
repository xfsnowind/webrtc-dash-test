import React, { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import dashjs from 'dashjs'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [player, setPlayer] = useState<dashjs.MediaPlayerClass | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      const dashPlayer = dashjs.MediaPlayer().create()
      dashPlayer.initialize(videoRef.current, 'http://localhost:3001/dash/manifest.mpd', true)
      setPlayer(dashPlayer)
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">DASH Live Streaming Demo</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <video ref={videoRef} controls className="w-full max-w-2xl mb-4 rounded-lg" />
        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Play className="mr-2" />
            Play Stream
          </button>
        </div>
      </div>
    </div>
  )
}

export default App