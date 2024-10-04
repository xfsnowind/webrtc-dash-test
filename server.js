import express from 'express'
import { createServer } from 'http'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Live streaming demo URL (NASA Live Stream)
const liveStreamUrl = 'https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-Public/master.m3u8'

// Ensure the dash directory exists
const dashDir = path.join(__dirname, 'public', 'dash')
if (!fs.existsSync(dashDir)) {
  fs.mkdirSync(dashDir, { recursive: true })
}

// Function to start DASH streaming
function startDashStreaming() {
  ffmpeg(liveStreamUrl)
    .outputOptions([
      '-map 0',
      '-c:v libx264',
      '-c:a aac',
      '-b:v:0 800k',
      '-b:v:1 300k',
      '-s:v:1 320x170',
      '-profile:v:1 baseline',
      '-profile:v:0 main',
      '-bf 1',
      '-keyint_min 120',
      '-g 120',
      '-sc_threshold 0',
      '-b_strategy 0',
      '-ar:a:1 22050',
      '-use_timeline 1',
      '-use_template 1',
      '-window_size 5',
      '-adaptation_sets "id=0,streams=v id=1,streams=a"',
      '-f dash'
    ])
    .output(path.join(dashDir, 'manifest.mpd'))
    .on('start', () => {
      console.log('DASH streaming started')
    })
    .on('error', (err) => {
      console.error('Error:', err)
    })
    .run()
}

// Start DASH streaming when the server starts
startDashStreaming()

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})