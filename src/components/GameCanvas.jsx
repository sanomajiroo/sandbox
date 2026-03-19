import { W, H } from '../constants'

export default function GameCanvas({ canvasRef, paint, selected, brush }) {
  const painting = { current: false }

  function doPaint(e) {
    if (!painting.current) return
    const pts = e.touches
      ? Array.from(e.touches)
      : [{ clientX: e.clientX, clientY: e.clientY }]
    for (const pt of pts) paint(pt.clientX, pt.clientY, selected, brush)
  }

  return (
    <div className="relative w-full" style={{ touchAction: 'none', userSelect: 'none' }}>
      {/* CRT effect layers */}
      <div className="absolute inset-0 scanlines crt-vignette scanline-beam pointer-events-none z-10" />

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
        onPointerDown={e => { painting.current = true; doPaint(e) }}
        onPointerMove={e => doPaint(e)}
        onPointerUp={() => { painting.current = false }}
        onPointerLeave={() => { painting.current = false }}
        onTouchStart={e => { e.preventDefault(); painting.current = true; doPaint(e) }}
        onTouchMove={e => { e.preventDefault(); doPaint(e) }}
        onTouchEnd={() => { painting.current = false }}
      />
    </div>
  )
}
