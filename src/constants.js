// ── Element IDs ──────────────────────────────────────────────
export const EMPTY      = 0
export const SAND       = 1
export const WATER      = 2
export const FIRE       = 3
export const SOIL       = 4
export const SMOKE      = 5
export const STEAM      = 6
export const LAVA       = 7
export const ASH        = 8
export const OIL        = 9
export const GAS        = 10
export const EXPLOSION  = 11
export const WOOD       = 12
export const ACID       = 13
export const STONE      = 14

// ── Grid dimensions ──────────────────────────────────────────
export const W = 100
export const H = 120

// ── Pixel colors per element (variants for texture) ──────────
export const COLORS = {
  [SAND]:      ['#e8c97a','#d4b55a','#c9a84c','#dfc06a','#e2c460'],
  [WATER]:     ['#4a9edd','#3a8ecd','#5aaeed','#2a7ebd','#3d96e0'],
  [FIRE]:      ['#ff4500','#ff6a00','#ff8c00','#ff2200','#ff3a00','#ffaa00'],
  [SOIL]:      ['#7a5c3a','#6a4c2a','#8a6c4a','#5a3c1a','#725535'],
  [SMOKE]:     ['#555','#666','#777','#444'],
  [STEAM]:     ['#aaddff','#99ccee','#bbddff','#cce8ff'],
  [LAVA]:      ['#ff3300','#ff5500','#ff8800','#dd2200','#ff4400','#ff6600'],
  [ASH]:       ['#888','#777','#999','#aaa','#696969'],
  [OIL]:       ['#2a2a1a','#1e1e0e','#3a3a2a','#252515'],
  [GAS]:       ['#88ff88','#66ee66','#aaff88','#99ff77'],
  [EXPLOSION]: ['#ffff00','#ffaa00','#ffffff','#ff8800','#ffe000'],
  [WOOD]:      ['#8B5E3C','#7a4e2c','#9B6E4C','#6a3e1c'],
  [ACID]:      ['#aaff00','#88ff00','#bbff44','#99ff22'],
  [STONE]:     ['#888','#999','#777','#aaa','#6e6e6e'],
}

// ── Physical density (higher = sinks) ────────────────────────
export const DENSITY = {
  [EMPTY]:0,[SAND]:4,[WATER]:2,[FIRE]:-1,[SOIL]:5,
  [SMOKE]:-3,[STEAM]:-4,[LAVA]:6,[ASH]:3,[OIL]:1.5,
  [GAS]:-5,[EXPLOSION]:0,[WOOD]:10,[ACID]:2,[STONE]:99,
}

export const IS_GAS_LIKE = new Set([FIRE, SMOKE, STEAM, GAS, EXPLOSION])

// ── Toolbar element palette ───────────────────────────────────
export const ELEMENTS = [
  { id: SAND,      label: 'SAND',  color: '#e8c97a', desc: '모래' },
  { id: WATER,     label: 'WATER', color: '#4a9edd', desc: '물' },
  { id: FIRE,      label: 'FIRE',  color: '#ff4500', desc: '불' },
  { id: SOIL,      label: 'SOIL',  color: '#7a5c3a', desc: '흙' },
  { id: WOOD,      label: 'WOOD',  color: '#8B5E3C', desc: '나무' },
  { id: STONE,     label: 'STONE', color: '#888888', desc: '돌' },
  { id: LAVA,      label: 'LAVA',  color: '#ff5500', desc: '용암' },
  { id: OIL,       label: 'OIL',   color: '#404030', desc: '기름' },
  { id: ACID,      label: 'ACID',  color: '#aaff00', desc: '산' },
  { id: GAS,       label: 'GAS',   color: '#88ff88', desc: '가스' },
  { id: EXPLOSION, label: 'BOMB',  color: '#ffaa00', desc: '폭탄' },
  { id: EMPTY,     label: 'ERASE', color: '#333333', desc: '지우개' },
]

export const EL_NAMES = {
  [SAND]:'SAND',[WATER]:'WATER',[FIRE]:'FIRE',[SOIL]:'SOIL',
  [SMOKE]:'SMOKE',[STEAM]:'STEAM',[LAVA]:'LAVA',[ASH]:'ASH',
  [OIL]:'OIL',[GAS]:'GAS',[EXPLOSION]:'BOMB',[WOOD]:'WOOD',
  [ACID]:'ACID',[STONE]:'STONE',
}
