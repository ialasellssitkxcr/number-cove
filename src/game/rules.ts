import { COLS, ROWS } from '../constants/config';
import type { Cell, Pos } from '../types';

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export const samePos = (a: Pos, b: Pos) => a.r === b.r && a.c === b.c;

export const inBounds = (p: Pos) =>
  p.r >= 0 && p.r < ROWS && p.c >= 0 && p.c < COLS;

export const cellAt = (grid: Cell[][], p: Pos): Cell => grid[p.r][p.c];

export const inPath = (path: Pos[], p: Pos) => path.some(q => samePos(q, p));

/** Shell ordinal the player is allowed to link next (1-based). */
export function nextShellNumber(grid: Cell[][], path: Pos[]): number {
  let linked = 0;
  for (const p of path) {
    if (cellAt(grid, p).kind === 'shell') {
      linked++;
    }
  }
  return linked + 1;
}

export function neighbours(p: Pos): Pos[] {
  const out: Pos[] = [];
  for (const d of DIRS) {
    const n = { r: p.r + d[0], c: p.c + d[1] };
    if (inBounds(n)) {
      out.push(n);
    }
  }
  return out;
}

export function isLegalStep(grid: Cell[][], path: Pos[], target: Pos): boolean {
  if (!inBounds(target)) {
    return false;
  }
  const cell = cellAt(grid, target);
  if (cell.kind === 'rock') {
    return false;
  }
  if (path.length === 0) {
    return cell.kind === 'shell' && cell.num === 1;
  }
  if (inPath(path, target)) {
    return false;
  }
  const head = path[path.length - 1];
  const dr = Math.abs(head.r - target.r);
  const dc = Math.abs(head.c - target.c);
  if (dr + dc !== 1) {
    return false;
  }
  if (cell.kind === 'shell' && cell.num !== nextShellNumber(grid, path)) {
    return false;
  }
  return true;
}

export function applyStep(path: Pos[], target: Pos): Pos[] {
  return path.concat([target]);
}

export function undoStep(path: Pos[]): Pos[] {
  return path.slice(0, Math.max(0, path.length - 1));
}

export function checkWin(
  grid: Cell[][],
  path: Pos[],
  shellCount: number,
): boolean {
  if (path.length === 0) {
    return false;
  }
  const head = cellAt(grid, path[path.length - 1]);
  return head.kind === 'shell' && head.num === shellCount;
}

export function hasLegalMove(grid: Cell[][], path: Pos[]): boolean {
  if (path.length === 0) {
    return true;
  }
  const head = path[path.length - 1];
  return neighbours(head).some(n => isLegalStep(grid, path, n));
}

function isSolutionPrefix(path: Pos[], solution: Pos[]): boolean {
  if (path.length > solution.length) {
    return false;
  }
  for (let i = 0; i < path.length; i++) {
    if (!samePos(path[i], solution[i])) {
      return false;
    }
  }
  return true;
}

function findShell(grid: Cell[][], num: number): Pos | null {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      if (cell.kind === 'shell' && cell.num === num) {
        return { r, c };
      }
    }
  }
  return null;
}

/**
 * One step of the reference route. Falls back to the legal neighbour closest to
 * the next shell when the player has wandered off the carved solution.
 */
export function nextHintStep(
  grid: Cell[][],
  path: Pos[],
  solution: Pos[],
): Pos | null {
  if (path.length === 0) {
    return solution.length > 0 ? solution[0] : null;
  }
  if (isSolutionPrefix(path, solution) && path.length < solution.length) {
    const cand = solution[path.length];
    if (isLegalStep(grid, path, cand)) {
      return cand;
    }
  }
  const head = path[path.length - 1];
  const legal = neighbours(head).filter(n => isLegalStep(grid, path, n));
  if (legal.length === 0) {
    return null;
  }
  const goal = findShell(grid, nextShellNumber(grid, path));
  if (!goal) {
    return legal[0];
  }
  let best = legal[0];
  let bestD = Infinity;
  for (const n of legal) {
    const d = Math.abs(n.r - goal.r) + Math.abs(n.c - goal.c);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best;
}
