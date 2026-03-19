import { useRef } from 'react'
import BrushSlider from './BrushSlider'

export default function ControlBar({ running, brush, onBrushChange, onToggleRun, onClear }) {
  const clearRef = useRef(null)

  function handleClear() {
    if (clearRef.current) {
      clearRef.current.classList.add('animate-reaction-shake')
      setTimeout(() => clearRef.current?.classList.remove('animate-reaction-shake'), 300)
    }
    onClear()
  }

  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-t border-[#1a1a1a] bg-[#0d0d0d] boot-item"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <BrushSlider value={brush} onChange={onBrushChange} />

      <div className="flex gap-2">
        {/* Play / Pause */}
        <button
          onClick={onToggleRun}
          className={[
            'relative text-[7px] w-10 h-8 border-2 flex items-center justify-center',
            'transition-all duration-150 active:scale-90 overflow-hidden',
            running
              ? 'border-[#4af] text-[#4af] bg-[#001a24]'
              : 'border-[#4af] text-[#4af] bg-[#111]',
          ].join(' ')}
          style={{ boxShadow: running ? '0 0 8px rgba(68,170,255,0.25), inset 0 0 8px rgba(68,170,255,0.05)' : 'none' }}
        >
          {/* Running pulse bg */}
          {running && (
            <span
              className="absolute inset-0 opacity-10"
              style={{
                background: 'rgba(68,170,255,0.3)',
                animation: 'pulse-border 1.2s ease-in-out infinite',
              }}
            />
          )}
          <span className="relative z-10">{running ? '⏸' : '▶'}</span>
        </button>

        {/* Clear */}
        <button
          ref={clearRef}
          onClick={handleClear}
          className="text-[7px] w-10 h-8 border-2 border-[#2a1a1a] text-[#c44] bg-[#111] flex items-center justify-center active:scale-90 transition-all duration-100 hover:border-[#c44] hover:bg-[#1a0808]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
