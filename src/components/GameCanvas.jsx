import { useRef, useEffect, useCallback } from 'react'
import { W, H } from '../constants'

export default function GameCanvas({ canvasRef, paint, selected, brush }) {
  const painting   = useRef(false)
  const wrapRef    = useRef(null)

  // selected/brush는 최신값을 ref로 유지 (stale closure 방지)
  const selectedRef = useRef(selected)
  const brushRef    = useRef(brush)
  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => { brushRef.current    = brush    }, [brush])

  const doPaint = useCallback((clientX, clientY) => {
    paint(clientX, clientY, selectedRef.current, brushRef.current)
  }, [paint])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    function onTouchStart(e) {
      e.preventDefault()
      painting.current = true
      for (const t of e.changedTouches) doPaint(t.clientX, t.clientY)
    }
    function onTouchMove(e) {
      e.preventDefault()
      if (!painting.current) return
      for (const t of e.changedTouches) doPaint(t.clientX, t.clientY)
    }
    function onTouchEnd(e) {
      e.preventDefault()
      painting.current = false
    }

    el.addEventListener('touchstart',  onTouchStart, { passive: false })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd,   { passive: false })
    el.addEventListener('touchcancel', onTouchEnd,   { passive: false })
    return () => {
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [doPaint])

  function onMouseDown(e) {
    painting.current = true
    doPaint(e.clientX, e.clientY)
  }
  function onMouseMove(e) {
    if (!painting.current) return
    doPaint(e.clientX, e.clientY)
  }
  function onMouseUp()    { painting.current = false }
  function onMouseLeave() { painting.current = false }

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {/* CRT effect layers */}
      <div className="absolute inset-0 scanlines crt-vignette pointer-events-none z-10" />

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full block border-2 border-[#1a1a1a]"
        style={{
          imageRendering: 'pixelated',
          cursor: 'crosshair',
          aspectRatio: `${W} / ${H}`,
          boxShadow: '0 0 0 1px #0a0a0a, 0 4px 32px rgba(0,0,0,0.9)',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
    </div>
  )
}
