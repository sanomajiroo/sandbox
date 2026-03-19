import {
  EMPTY, SAND, WATER, FIRE, SOIL, SMOKE, STEAM,
  LAVA, ASH, OIL, GAS, EXPLOSION, WOOD, ACID, STONE,
  W, H, DENSITY, IS_GAS_LIKE, EL_NAMES,
} from '../constants'

// ── Grid accessors ────────────────────────────────────────────
export const idx      = (x, y) => y * W + x
export const inBounds = (x, y) => x >= 0 && x < W && y >= 0 && y < H
export const get      = (grid, x, y) => inBounds(x, y) ? grid[idx(x, y)] : -1

export function set(grid, colorGrid, x, y, v) {
  if (!inBounds(x, y)) return
  const i = idx(x, y)
  grid[i] = v
  if (v !== EMPTY) colorGrid[i] = Math.floor(Math.random() * 5)
}

export function swap(grid, colorGrid, x1, y1, x2, y2) {
  const i1 = idx(x1, y1), i2 = idx(x2, y2)
  let t = grid[i1]; grid[i1] = grid[i2]; grid[i2] = t
  t = colorGrid[i1]; colorGrid[i1] = colorGrid[i2]; colorGrid[i2] = t
}

// ── Physics helpers ───────────────────────────────────────────
function canDisplace(mover, target) {
  if (target === EMPTY) return true
  if (target === WOOD || target === STONE) return false
  if (IS_GAS_LIKE.has(target)) return false
  return DENSITY[mover] > DENSITY[target]
}

function tryFallDown(grid, colorGrid, updated, frame, x, y, v) {
  const n = get(grid, x, y + 1)
  if (n === -1) return false
  if (!canDisplace(v, n)) return false
  if (n === EMPTY) { set(grid, colorGrid, x, y + 1, v); set(grid, colorGrid, x, y, EMPTY) }
  else { swap(grid, colorGrid, x, y, x, y + 1) }
  updated[idx(x, y + 1)] = frame
  return true
}

function tryFallDiag(grid, colorGrid, updated, frame, x, y, d, v) {
  const nx = x + d
  if (!inBounds(nx, y + 1)) return false
  if (get(grid, nx, y + 1) !== EMPTY) return false
  set(grid, colorGrid, nx, y + 1, v)
  set(grid, colorGrid, x, y, EMPTY)
  updated[idx(nx, y + 1)] = frame
  return true
}

function trySlide(grid, colorGrid, updated, frame, x, y, d, v) {
  const nx = x + d
  if (!inBounds(nx, y)) return false
  const n = get(grid, nx, y)
  if (!canDisplace(v, n)) return false
  if (n === EMPTY) { set(grid, colorGrid, nx, y, v); set(grid, colorGrid, x, y, EMPTY) }
  else { swap(grid, colorGrid, x, y, nx, y) }
  updated[idx(nx, y)] = frame
  return true
}

// ── Cell update rules ─────────────────────────────────────────
function updateSand(grid, colorGrid, updated, frame, x, y) {
  if (tryFallDown(grid, colorGrid, updated, frame, x, y, SAND)) return
  const d = Math.random() < 0.5 ? 1 : -1
  if (tryFallDiag(grid, colorGrid, updated, frame, x, y, d, SAND)) return
  tryFallDiag(grid, colorGrid, updated, frame, x, y, -d, SAND)
}

function updateSoil(grid, colorGrid, updated, frame, x, y) {
  if (tryFallDown(grid, colorGrid, updated, frame, x, y, SOIL)) return
  if (Math.random() < 0.1) {
    const d = Math.random() < 0.5 ? 1 : -1
    tryFallDiag(grid, colorGrid, updated, frame, x, y, d, SOIL)
  }
}

function updateAsh(grid, colorGrid, updated, frame, x, y) {
  if (tryFallDown(grid, colorGrid, updated, frame, x, y, ASH)) return
  const d = Math.random() < 0.5 ? 1 : -1
  if (tryFallDiag(grid, colorGrid, updated, frame, x, y, d, ASH)) return
  tryFallDiag(grid, colorGrid, updated, frame, x, y, -d, ASH)
}

function updateLiquid(grid, colorGrid, updated, frame, x, y, v) {
  if (tryFallDown(grid, colorGrid, updated, frame, x, y, v)) return
  const d = Math.random() < 0.5 ? 1 : -1
  for (let s = 1; s <= 3; s++) {
    if (trySlide(grid, colorGrid, updated, frame, x, y, d * s, v)) return
  }
  for (let s = 1; s <= 3; s++) {
    if (trySlide(grid, colorGrid, updated, frame, x, y, -d * s, v)) return
  }
}

function updateAcid(grid, colorGrid, updated, frame, x, y, onReact) {
  updateLiquid(grid, colorGrid, updated, frame, x, y, ACID)
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
  for (const [dx, dy] of dirs) {
    const n = get(grid, x + dx, y + dy)
    if ([SAND, SOIL, STONE, ASH, WOOD].includes(n) && Math.random() < 0.04) {
      set(grid, colorGrid, x + dx, y + dy, EMPTY)
      if (Math.random() < 0.4) { set(grid, colorGrid, x, y, EMPTY); return }
      onReact(`ACID DISSOLVES ${EL_NAMES[n]}!`)
    }
  }
}

function updateLava(grid, colorGrid, updated, frame, x, y, onReact) {
  if (tryFallDown(grid, colorGrid, updated, frame, x, y, LAVA)) return
  const d = Math.random() < 0.5 ? 1 : -1
  if (trySlide(grid, colorGrid, updated, frame, x, y, d, LAVA)) return
  trySlide(grid, colorGrid, updated, frame, x, y, -d, LAVA)
  if (Math.random() < 0.03) set(grid, colorGrid, x, y - 1, SMOKE)
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
  for (const [dx, dy] of dirs) {
    const n = get(grid, x + dx, y + dy)
    if (n === WATER && Math.random() < 0.25) {
      set(grid, colorGrid, x + dx, y + dy, STEAM)
      if (Math.random() < 0.3) { set(grid, colorGrid, x, y, STONE); onReact('LAVA + WATER = STONE!') }
      return
    }
    if ((n === WOOD || n === OIL) && Math.random() < 0.06) {
      set(grid, colorGrid, x + dx, y + dy, FIRE)
      onReact(`LAVA IGNITES ${EL_NAMES[n]}!`)
    }
    if (n === GAS && Math.random() < 0.4) {
      set(grid, colorGrid, x + dx, y + dy, EXPLOSION)
      onReact('GAS EXPLOSION!')
    }
  }
}

function updateFire(grid, colorGrid, updated, frame, x, y, onReact) {
  if (Math.random() < 0.04) { set(grid, colorGrid, x, y, SMOKE); return }
  if (get(grid, x, y - 1) === EMPTY && Math.random() < 0.3) {
    set(grid, colorGrid, x, y - 1, FIRE)
    updated[idx(x, y - 1)] = frame
  }
  const dirs = [[0,-1],[0,1],[1,0],[-1,0],[1,-1],[-1,-1],[1,1],[-1,1]]
  for (const [dx, dy] of dirs) {
    const nx = x + dx, ny = y + dy
    const n = get(grid, nx, ny)
    if (n === WOOD && Math.random() < 0.07) { set(grid, colorGrid, nx, ny, FIRE); onReact('WOOD IS BURNING!') }
    if (n === OIL && Math.random() < 0.15)  { set(grid, colorGrid, nx, ny, FIRE) }
    if (n === WATER && Math.random() < 0.35) {
      set(grid, colorGrid, nx, ny, STEAM)
      set(grid, colorGrid, x, y, EMPTY)
      onReact('FIRE + WATER = STEAM!')
      return
    }
    if (n === GAS && Math.random() < 0.6) {
      set(grid, colorGrid, nx, ny, EXPLOSION)
      set(grid, colorGrid, x, y, EMPTY)
      onReact('💥 GAS EXPLOSION!')
      return
    }
    if (n === SOIL && Math.random() < 0.015) set(grid, colorGrid, nx, ny, ASH)
    if (n === SAND && Math.random() < 0.003) { set(grid, colorGrid, nx, ny, LAVA); onReact('SAND MELTS → LAVA!') }
    if (n === ACID && Math.random() < 0.1)   { set(grid, colorGrid, nx, ny, EMPTY); set(grid, colorGrid, x, y, EMPTY); return }
  }
}

function updateGasLike(grid, colorGrid, x, y, v) {
  const dx = Math.floor(Math.random() * 3) - 1
  const ny = y - 1, nx = x + dx
  if (get(grid, nx, ny) === EMPTY) { set(grid, colorGrid, nx, ny, v); set(grid, colorGrid, x, y, EMPTY); return }
  if (get(grid, x, ny) === EMPTY)  { set(grid, colorGrid, x, ny, v);  set(grid, colorGrid, x, y, EMPTY); return }
  if (Math.random() < 0.04) set(grid, colorGrid, x, y, EMPTY)
}

function doExplosion(grid, colorGrid, x, y, onReact) {
  const r = 3 + Math.floor(Math.random() * 4)
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue
      const nx = x + dx, ny = y + dy
      const n = get(grid, nx, ny)
      if (n === EMPTY || n === EXPLOSION || n === STONE) continue
      if (n === WATER)             set(grid, colorGrid, nx, ny, STEAM)
      else if (n === OIL || n === WOOD) set(grid, colorGrid, nx, ny, FIRE)
      else if (n === GAS)          set(grid, colorGrid, nx, ny, EXPLOSION)
      else if ([SAND,SOIL,ASH].includes(n) && Math.random() < 0.6) set(grid, colorGrid, nx, ny, EMPTY)
      else if (Math.random() < 0.3) set(grid, colorGrid, nx, ny, EMPTY)
    }
  }
  for (let i = 0; i < 8; i++) {
    const fx = x + Math.floor(Math.random() * 11) - 5
    const fy = y + Math.floor(Math.random() * 11) - 5
    if (get(grid, fx, fy) === EMPTY) set(grid, colorGrid, fx, fy, FIRE)
  }
  set(grid, colorGrid, x, y, EMPTY)
  onReact('💥 BOOM!')
}

// ── Main step function ────────────────────────────────────────
export function stepSimulation(grid, colorGrid, onReact) {
  const updated = new Uint32Array(W * H)
  const frame = Date.now()

  // Random horizontal sweep order each frame
  const order = Array.from({ length: W }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }

  for (let y = H - 1; y >= 0; y--) {
    for (const x of order) {
      const i = idx(x, y)
      if (updated[i] === frame) continue
      const v = grid[i]
      if (v === EMPTY) continue
      updated[i] = frame

      switch (v) {
        case SAND:      updateSand(grid, colorGrid, updated, frame, x, y); break
        case SOIL:      updateSoil(grid, colorGrid, updated, frame, x, y); break
        case ASH:       updateAsh(grid, colorGrid, updated, frame, x, y); break
        case WATER:     updateLiquid(grid, colorGrid, updated, frame, x, y, WATER); break
        case OIL:       updateLiquid(grid, colorGrid, updated, frame, x, y, OIL); break
        case ACID:      updateAcid(grid, colorGrid, updated, frame, x, y, onReact); break
        case LAVA:      updateLava(grid, colorGrid, updated, frame, x, y, onReact); break
        case FIRE:      updateFire(grid, colorGrid, updated, frame, x, y, onReact); break
        case SMOKE:
        case STEAM:
        case GAS:       updateGasLike(grid, colorGrid, x, y, v); break
        case EXPLOSION: doExplosion(grid, colorGrid, x, y, onReact); break
      }
    }
  }
}

// ── Initial scene seed ────────────────────────────────────────
export function seedScene(grid, colorGrid) {
  // Stone floor
  for (let x = 0; x < W; x++) {
    for (let y = H - 4; y < H; y++) set(grid, colorGrid, x, y, STONE)
  }
  // Soil layer
  for (let x = 0; x < W; x++) {
    for (let y = H - 7; y < H - 4; y++) set(grid, colorGrid, x, y, SOIL)
  }
  // Sand pile left
  for (let i = 0; i < 80; i++) {
    set(grid, colorGrid, Math.floor(Math.random() * 30) + 5, Math.floor(Math.random() * 12) + H - 20, SAND)
  }
  // Water pool right
  for (let x = 60; x < 90; x++) {
    for (let y = H - 12; y < H - 7; y++) set(grid, colorGrid, x, y, WATER)
  }
  // Wood log center
  for (let x = 35; x < 48; x++) set(grid, colorGrid, x, H - 8, WOOD)
  set(grid, colorGrid, 35, H - 9, WOOD)
  set(grid, colorGrid, 47, H - 9, WOOD)
}

// ── Paint brush ───────────────────────────────────────────────
export function paintBrush(grid, colorGrid, cx, cy, radius, element) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius + radius) {
        set(grid, colorGrid, cx + dx, cy + dy, element)
      }
    }
  }
}
