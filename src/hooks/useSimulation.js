import { useRef, useState, useCallback, useEffect } from 'react'
import { W, H, COLORS, EMPTY, FIRE, LAVA, EXPLOSION } from '../constants'
import { idx, stepSimulation, seedScene, paintBrush } from '../simulation/physics'

// Precompute hex → [r,g,b]
const hexCache = {}
function hexToRgb(hex) {
  if (hexCache[hex]) return hexCache[hex]
  let h = hex.replace('#', '')
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
  const r = { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
  hexCache[hex] = r
  return r
}

export function useSimulation() {
  const gridRef      = useRef(new Uint8Array(W * H))
  const colorRef     = useRef(new Uint8Array(W * H))
  const runningRef   = useRef(false)
  const rafRef       = useRef(null)
  const canvasRef    = useRef(null)
  const offscreenRef = useRef(null)
  const imgDataRef   = useRef(null)
  const pxRef        = useRef(null)

  const [running,  setRunning]  = useState(false)
  const [fps,      setFps]      = useState(0)
  const [reaction, setReaction] = useState('— awaiting reactions —')
  const [pxCount,  setPxCount]  = useState(0)

  const reactionTimerRef = useRef(null)
  const onReact = useCallback((msg) => {
    setReaction('⚡ ' + msg)
    clearTimeout(reactionTimerRef.current)
    reactionTimerRef.current = setTimeout(() => setReaction('— awaiting reactions —'), 1200)
  }, [])

  // Init offscreen canvas + imgData
  useEffect(() => {
    const off = document.createElement('canvas')
    off.width = W
    off.height = H
    offscreenRef.current = off
    const offCtx = off.getContext('2d')
    const imgData = offCtx.createImageData(W, H)
    imgDataRef.current = imgData
    pxRef.current = imgData.data
    // fill alpha=255
    for (let i = 3; i < imgData.data.length; i += 4) imgData.data[i] = 255

    // Seed initial scene
    seedScene(gridRef.current, colorRef.current)
  }, [])

  // Render
  const render = useCallback(() => {
    if (!canvasRef.current || !pxRef.current) return
    const grid = gridRef.current
    const color = colorRef.current
    const px = pxRef.current
    let count = 0

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = idx(x, y)
        const v = grid[i]
        const pi = i * 4
        if (v === EMPTY) {
          const dark = (x + y) % 2 === 0 ? 13 : 16
          px[pi] = dark; px[pi+1] = dark; px[pi+2] = dark
          continue
        }
        count++
        const cols = COLORS[v]
        if (!cols) continue
        let ci = color[i] % cols.length
        // Flicker for fire/lava/explosion
        if (v === FIRE || v === LAVA || v === EXPLOSION) ci = Math.floor(Math.random() * cols.length)
        const { r, g, b } = hexToRgb(cols[ci])
        px[pi] = r; px[pi+1] = g; px[pi+2] = b
      }
    }

    const offCtx = offscreenRef.current.getContext('2d')
    offCtx.putImageData(imgDataRef.current, 0, 0)

    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(offscreenRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

    setPxCount(count)
  }, [])

  // Main loop
  useEffect(() => {
    let fpsCount = 0
    let lastTime = performance.now()

    function loop(now) {
      if (runningRef.current) {
        stepSimulation(gridRef.current, colorRef.current, onReact)
      }
      render()
      fpsCount++
      if (now - lastTime >= 1000) {
        setFps(fpsCount)
        fpsCount = 0
        lastTime = now
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [render, onReact])

  const toggleRun = useCallback(() => {
    runningRef.current = !runningRef.current
    setRunning(r => !r)
  }, [])

  const clearAll = useCallback(() => {
    gridRef.current.fill(0)
    colorRef.current.fill(0)
  }, [])

  // Paint from pointer event
  const paint = useCallback((clientX, clientY, element, brush) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const fx = (clientX - rect.left) / rect.width
    const fy = (clientY - rect.top)  / rect.height
    const gx = Math.floor(fx * W)
    const gy = Math.floor(fy * H)
    paintBrush(gridRef.current, colorRef.current, gx, gy, brush, element)
  }, [])

  return {
    canvasRef, running, fps, reaction, pxCount,
    toggleRun, clearAll, paint,
  }
}
