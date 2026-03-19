import { useEffect, useState } from 'react'

export default function GlitchHeader({ running, fps, pxCount }) {
  const [glitching, setGlitching] = useState(false)

  // Random glitch bursts every few seconds
  useEffect(() => {
    function scheduleGlitch() {
      const delay = 3000 + Math.random() * 5000
      const timer = setTimeout(() => {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 350)
        scheduleGlitch()
      }, delay)
      return timer
    }
    const t = scheduleGlitch()
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex flex-col items-center pt-3 pb-2 border-b border-[#1e1e1e] overflow-hidden boot-item">
      {/* Decorative top bar */}
      <div className="w-full flex items-center gap-0 mb-2 px-3">
        <div className="h-px flex-1 bg-[#f7c94e] opacity-20" />
        <span className="text-[4px] text-[#3a3a3a] px-2 tracking-widest">SYS://PARTICLE_ENGINE_v2.0</span>
        <div className="h-px flex-1 bg-[#f7c94e] opacity-20" />
      </div>

      {/* Glitch title */}
      <div className="relative select-none" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        {/* Base text */}
        <h1
          className="text-[13px] text-[#f7c94e] tracking-widest relative z-10 animate-crt-flicker"
          style={{ textShadow: '2px 2px 0 #7a4e00, 0 0 20px rgba(247,201,78,0.3)' }}
        >
          ☆ SANDBOXELS ☆
        </h1>

        {/* Glitch layer 1 */}
        {glitching && (
          <span
            className="absolute inset-0 text-[13px] tracking-widest text-[#ff4500] pointer-events-none z-20"
            style={{
              textShadow: 'none',
              clipPath: 'inset(20% 0 60% 0)',
              transform: 'translate(-3px, 0)',
              opacity: 0.85,
            }}
            aria-hidden
          >
            ☆ SANDBOXELS ☆
          </span>
        )}
        {/* Glitch layer 2 */}
        {glitching && (
          <span
            className="absolute inset-0 text-[13px] tracking-widest text-[#4af] pointer-events-none z-20"
            style={{
              textShadow: 'none',
              clipPath: 'inset(55% 0 20% 0)',
              transform: 'translate(3px, 0)',
              opacity: 0.7,
            }}
            aria-hidden
          >
            ☆ SANDBOXELS ☆
          </span>
        )}
      </div>

      <p
        className="text-[5px] text-[#2e2e2e] tracking-[4px] mt-1 pixel-cursor"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        PIXEL PARTICLE SIMULATOR
      </p>

      {/* Live stats strip */}
      <div
        className="flex gap-4 mt-2 px-3 py-1 border border-[#1e1e1e] bg-[#0d0d0d]"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <span className="text-[4px] text-[#333]">
          FPS <span className={fps >= 50 ? 'text-[#4f4]' : fps >= 30 ? 'text-[#f7c94e]' : 'text-[#c44]'}>{fps}</span>
        </span>
        <span className="text-[#1e1e1e]">|</span>
        <span className="text-[4px] text-[#333]">
          PX <span className="text-[#555]">{pxCount.toLocaleString()}</span>
        </span>
        <span className="text-[#1e1e1e]">|</span>
        <span className="text-[4px]">
          <span className={running ? 'text-[#4f4]' : 'text-[#555]'}>
            {running ? '● RUN' : '○ IDLE'}
          </span>
        </span>
      </div>
    </div>
  )
}
