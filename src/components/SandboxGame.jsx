import { useState } from 'react'
import { ELEMENTS } from '../constants'
import { useSimulation } from '../hooks/useSimulation'
import GameCanvas from './GameCanvas'
import ElementButton from './ElementButton'
import ControlBar from './ControlBar'
import ReactionLog from './ReactionLog'
import ReactionCheatsheet from './ReactionCheatsheet'
import GlitchHeader from './GlitchHeader'

export default function SandboxGame() {
  const [selected, setSelected] = useState(1) // SAND
  const [brush, setBrush]       = useState(3)

  const {
    canvasRef, running, fps, reaction, pxCount,
    toggleRun, clearAll, paint,
  } = useSimulation()

  return (
    <div
      className="flex flex-col w-full max-w-md bg-[#0f0f0f] text-white min-h-screen animate-crt-flicker"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* ── Glitch Header ── */}
      <GlitchHeader running={running} fps={fps} pxCount={pxCount} />

      {/* ── Canvas + CRT ── */}
      <div className="px-2 pt-2 boot-item">
        <GameCanvas
          canvasRef={canvasRef}
          paint={paint}
          selected={selected}
          brush={brush}
        />
      </div>

      {/* ── Reaction Log ── */}
      <div className="px-2 pt-1 pb-1 boot-item">
        <ReactionLog message={reaction} />
      </div>

      {/* ── Element Palette ── */}
      <div className="px-2 pb-1 boot-item">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <span className="text-[4px] text-[#252525] tracking-[2px]">SELECT ELEMENT</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
        </div>

        <div className="grid grid-cols-6 gap-[3px]">
          {ELEMENTS.map(el => (
            <ElementButton
              key={el.id}
              element={el}
              selected={selected}
              onClick={setSelected}
            />
          ))}
        </div>

        {/* Selected element info bar */}
        <div className="flex items-center gap-2 mt-1 px-2 py-[5px] bg-[#0d0d0d] border border-[#181818]">
          <span
            className="w-2 h-2 flex-shrink-0"
            style={{
              background: ELEMENTS.find(e => e.id === selected)?.color ?? '#aaa',
              imageRendering: 'pixelated',
              boxShadow: `0 0 5px ${ELEMENTS.find(e => e.id === selected)?.color ?? '#aaa'}66`,
            }}
          />
          <span className="text-[4px] text-[#f7c94e]">
            {ELEMENTS.find(e => e.id === selected)?.label ?? 'SAND'}
          </span>
          <span className="text-[4px] text-[#2a2a2a] ml-1">
            {ELEMENTS.find(e => e.id === selected)?.desc ?? ''}
          </span>
        </div>
      </div>

      {/* ── Controls ── */}
      <ControlBar
        running={running}
        brush={brush}
        onBrushChange={setBrush}
        onToggleRun={toggleRun}
        onClear={clearAll}
      />

      {/* ── Reaction Cheatsheet ── */}
      <ReactionCheatsheet />
    </div>
  )
}

