import { useRef } from 'react'

export default function ElementButton({ element, selected, onClick }) {
  const isActive = selected === element.id
  const isErase  = element.id === 0
  const btnRef   = useRef(null)

  function handleClick() {
    if (btnRef.current) {
      btnRef.current.classList.remove('animate-elem-select')
      void btnRef.current.offsetWidth
      btnRef.current.classList.add('animate-elem-select')
    }
    onClick(element.id)
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={[
        'relative flex flex-col items-center justify-center gap-[3px] py-[7px] px-1',
        'border-2 active:scale-90',
        isActive
          ? 'border-[#f7c94e] text-[#f7c94e] bg-[#1a1500] elem-active'
          : 'border-[#252525] text-[#555] bg-[#141414]',
      ].join(' ')}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        minWidth: 0,
        transition: 'border-color 0.1s, background 0.1s, transform 0.08s',
      }}
    >
      <span
        className="block w-[10px] h-[10px]"
        style={{
          background: element.color,
          imageRendering: 'pixelated',
          border: isErase ? '1px solid #333' : 'none',
          boxShadow: isActive ? `0 0 6px ${element.color}88` : 'none',
        }}
      />
      <span className="text-[4px] leading-none">{element.label}</span>

      {isActive && (
        <>
          <span className="absolute top-0 left-0 w-[3px] h-[3px] bg-[#f7c94e]" />
          <span className="absolute top-0 right-0 w-[3px] h-[3px] bg-[#f7c94e]" />
          <span className="absolute bottom-0 left-0 w-[3px] h-[3px] bg-[#f7c94e]" />
          <span className="absolute bottom-0 right-0 w-[3px] h-[3px] bg-[#f7c94e]" />
        </>
      )}
    </button>
  )
}
