import { COLS, ROWS } from '../constants/config';
import type { Cell, LevelData, Pos } from '../types';

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/** Deterministic PRNG so a level looks identical between launches. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const key = (p: Pos) => p.r * COLS + p.c;

function shuffled<T>(src: ReadonlyArray<T>, rng: () => number): T[] {
  const out = src.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Boustrophedon sweep, always self-avoiding, used if the walk gives up. */
function snakePath(len: number): Pos[] {
  const out: Pos[] = [];
  for (let r = 0; r < ROWS && out.length < len; r++) {
    for (let i = 0; i < COLS && out.length < len; i++) {
      const c = r % 2 === 0 ? i : COLS - 1 - i;
      out.push({ r, c });
    }
  }
  return out;
}

/** Self-avoiding walk of exactly `len` cells, carved with backtracking. */
function carvePath(len: number, rng: () => number): Pos[] {
  for (let attempt = 0; attempt < 5; attempt++) {
    const start: Pos = {
      r: Math.floor(rng() * ROWS),
      c: Math.floor(rng() * COLS),
    };
    const path: Pos[] = [start];
    const seen = new Set<number>([key(start)]);
    let budget = 40000;

    const walk = (): boolean => {
      if (path.length >= len) {
        return true;
      }
      if (budget-- <= 0) {
        return false;
      }
      const head = path[path.length - 1];
      for (const d of shuffled(DIRS, rng)) {
        const next: Pos = { r: head.r + d[0], c: head.c + d[1] };
        if (next.r < 0 || next.r >= ROWS || next.c < 0 || next.c >= COLS) {
          continue;
        }
        const k = key(next);
        if (seen.has(k)) {
          continue;
        }
        seen.add(k);
        path.push(next);
        if (walk()) {
          return true;
        }
        seen.delete(k);
        path.pop();
      }
      return false;
    };

    if (walk()) {
      return path;
    }
  }
  return snakePath(len);
}

function emptyGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({ kind: 'sand' });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Constructive generation: the route is carved first, shells are seeded ON it
 * and rocks only ever land OFF it, so every level is solvable by construction
 * and par is exact. No generate-and-check, no fallback layouts.
 */
export function buildLevel(level: number): LevelData {
  const rng = mulberry32(level * 7919 + 13);
  const len = Math.min(ROWS * COLS - 10, 14 + level);
  const solution = carvePath(len, rng);
  const grid = emptyGrid();

  const shellCount = Math.min(7, 4 + Math.floor((level - 1) / 2));
  const onPath = new Set<number>(solution.map(key));

  for (let i = 0; i < shellCount; i++) {
    const idx =
      shellCount === 1
        ? 0
        : Math.round((i * (solution.length - 1)) / (shellCount - 1));
    const p = solution[idx];
    grid[p.r][p.c] = { kind: 'shell', num: i + 1 };
  }

  const free: Pos[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!onPath.has(r * COLS + c)) {
        free.push({ r, c });
      }
    }
  }
  const rockCount = Math.min(7, Math.min(level, free.length));
  const rockCells = shuffled(free, rng).slice(0, rockCount);
  for (const p of rockCells) {
    grid[p.r][p.c] = { kind: 'rock' };
  }

  return {
    grid,
    solution,
    par: solution.length - 1,
    shellCount,
  };
}
