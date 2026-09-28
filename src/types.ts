export type Pos = { r: number; c: number };

export type CellKind = 'sand' | 'rock' | 'shell';

export type Cell = {
  kind: CellKind;
  /** Shell ordinal 1..N, undefined for sand/rock. */
  num?: number;
};

export type LevelData = {
  grid: Cell[][];
  solution: Pos[];
  par: number;
  shellCount: number;
};

export type RoundResult = {
  won: boolean;
  moves: number;
  par: number;
  level: number;
};

export type Screen = 'loader' | 'menu' | 'game' | 'gameover';
