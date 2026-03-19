const REACTIONS = [
  { from: 'FIRE',  plus: 'WATER',  to: 'STEAM',   icon: '💧' },
  { from: 'FIRE',  plus: 'WOOD',   to: 'BURNS',   icon: '🪵' },
  { from: 'LAVA',  plus: 'WATER',  to: 'STONE',   icon: '🌋' },
  { from: 'BOMB',  plus: 'GAS',    to: 'CHAIN',   icon: '⛽' },
  { from: 'ACID',  plus: 'STONE',  to: 'DISSOLVE',icon: '🧪' },
  { from: 'FIRE',  plus: 'OIL',    to: 'IGNITE',  icon: '🛢' },
]

export default function ReactionCheatsheet() {
  return (
    <div
      className="px-3 py-2 border-t border-[#151515] boot-item"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-[#1e1e1e]" />
        <span className="text-[4px] text-[#2a2a2a] tracking-[3px]">REACTIONS</span>
        <div className="h-px flex-1 bg-[#1e1e1e]" />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-[5px]">
        {REACTIONS.map(({ from, plus, to, icon }, i) => (
          <div
            key={i}
            className="flex items-center gap-1 group cursor-default"
            style={{
              animation: `boot-reveal 0.3s ${0.05 + i * 0.06}s ease-out both`,
            }}
          >
            <span className="text-[6px]">{icon}</span>
            <span className="text-[4px] text-[#2a2a2a] group-hover:text-[#444] transition-colors">
              {from}+{plus}
            </span>
            <span className="text-[4px] text-[#1e1e1e]">→</span>
            <span className="text-[4px] text-[#f7c94e] opacity-60 group-hover:opacity-100 transition-opacity">
              {to}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-[3px] text-[#1e1e1e] text-center mt-2 tracking-widest">
        TOUCH CANVAS TO PAINT · HOLD TO STREAM
      </p>
    </div>
  )
}
