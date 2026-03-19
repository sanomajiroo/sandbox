import { useEffect, useRef, useState } from 'react'

export default function ReactionLog({ message }) {
  const [key, setKey]     = useState(0)
  const [active, setActive] = useState(false)
  const prevMsg = useRef(message)
  const timerRef = useRef(null)

  useEffect(() => {
    if (message !== prevMsg.current && message !== '— awaiting reactions —') {
      prevMsg.current = message
      setActive(true)
      setKey(k => k + 1)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setActive(false), 1400)
    }
  }, [message])

  const isAwait = message === '— awaiting reactions —'

  return (
    <div
      className="relative flex items-center justify-center gap-2 px-3 py-[5px] border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden"
      style={{ minHeight: 26 }}
    >
      {/* Animated accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300"
        style={{ background: active ? '#f7c94e' : '#1e1e1e' }}
      />

      {/* Icon */}
      <span
        className="text-[8px] transition-all duration-200"
        style={{
          filter: active ? 'drop-shadow(0 0 4px rgba(247,201,78,0.8))' : 'none',
          transform: active ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {isAwait ? '◇' : '⚡'}
      </span>

      {/* Message */}
      <span
        key={key}
        className={[
          'text-[5px] tracking-wide',
          active ? 'animate-reaction-pop reaction-glow' : 'text-[#333]',
        ].join(' ')}
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        {isAwait ? 'AWAITING REACTIONS' : message.replace('⚡ ', '')}
      </span>

      {/* Right bar */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[2px] transition-colors duration-300"
        style={{ background: active ? '#f7c94e' : '#1e1e1e' }}
      />
    </div>
  )
}
