export default function BrushSlider({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[5px] text-[#444]"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        BRUSH
      </span>

      {/* Visual preview circle */}
      <div className="flex items-center justify-center w-5 h-5">
        <div
          className="bg-[#f7c94e] transition-all duration-150"
          style={{
            width:  Math.max(3, value * 1.5),
            height: Math.max(3, value * 1.5),
            imageRendering: 'pixelated',
            boxShadow: `0 0 ${value}px rgba(247,201,78,0.4)`,
          }}
        />
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-14"
      />

      <span
        className="text-[5px] text-[#f7c94e] w-3 text-right"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        {value}
      </span>
    </div>
  )
}
