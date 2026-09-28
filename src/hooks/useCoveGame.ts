import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  AUTO_ADVANCE_MS,
  ERROR_BLINK_MS,
  IDLE_BACKSTOP_MS,
  MOVE_SLACK,
} from '../constants/config';
import { buildLevel } from '../game/levels';
import {
  applyStep,
  checkWin,
  hasLegalMove,
  isLegalStep,
  nextHintStep,
  nextShellNumber,
  undoStep,
} from '../game/rules';
import type { Pos, RoundResult } from '../types';

type Params = {
  level: number;
  onGameOver: (result: RoundResult) => void;
  onSpendPearl: () => void;
};

type Timer = ReturnType<typeof setTimeout> | null;

/**
 * Round state machine plus the two timers that guarantee the headless runner
 * always reaches a result frame: a paced autopilot that walks the reference
 * route, and an independent backstop that resolves the round no matter what.
 */
export function useCoveGame({ level, onGameOver, onSpendPearl }: Params) {
  const data = useMemo(() => buildLevel(level), [level]);
  const moveLimit = data.par + MOVE_SLACK;

  const [path, setPath] = useState<Pos[]>([]);
  const [moves, setMoves] = useState(0);
  const [errorCell, setErrorCell] = useState<Pos | null>(null);

  const pathRef = useRef<Pos[]>([]);
  const movesRef = useRef(0);
  const doneRef = useRef(false);
  const autoRef = useRef<Timer>(null);
  const idleRef = useRef<Timer>(null);
  const blinkRef = useRef<Timer>(null);

  const overRef = useRef(onGameOver);
  overRef.current = onGameOver;
  const spendRef = useRef(onSpendPearl);
  spendRef.current = onSpendPearl;

  const stepRef = useRef<(target: Pos) => boolean>(() => false);
  const finishRef = useRef<(won: boolean) => void>(() => {});
  const armRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    if (autoRef.current) {
      clearTimeout(autoRef.current);
      autoRef.current = null;
    }
    if (idleRef.current) {
      clearTimeout(idleRef.current);
      idleRef.current = null;
    }
    if (blinkRef.current) {
      clearTimeout(blinkRef.current);
      blinkRef.current = null;
    }
  }, []);

  const finish = useCallback(
    (won: boolean) => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      clearTimers();
      overRef.current({
        won,
        moves: movesRef.current,
        par: data.par,
        level,
      });
    },
    [clearTimers, data.par, level],
  );
  finishRef.current = finish;

  const armAuto = useCallback(() => {
    if (autoRef.current) {
      clearTimeout(autoRef.current);
    }
    autoRef.current = setTimeout(() => {
      if (doneRef.current) {
        return;
      }
      const target = nextHintStep(data.grid, pathRef.current, data.solution);
      if (!target) {
        finishRef.current(false);
        return;
      }
      stepRef.current(target);
    }, AUTO_ADVANCE_MS);
  }, [data]);
  armRef.current = armAuto;

  const blink = useCallback((cell: Pos) => {
    setErrorCell(cell);
    if (blinkRef.current) {
      clearTimeout(blinkRef.current);
    }
    blinkRef.current = setTimeout(() => setErrorCell(null), ERROR_BLINK_MS);
  }, []);

  const commitStep = useCallback(
    (target: Pos): boolean => {
      if (doneRef.current) {
        return false;
      }
      if (!isLegalStep(data.grid, pathRef.current, target)) {
        blink(target);
        return false;
      }
      const next = applyStep(pathRef.current, target);
      pathRef.current = next;
      setPath(next);

      if (next.length > 1) {
        movesRef.current += 1;
        setMoves(movesRef.current);
      }

      armRef.current();

      if (checkWin(data.grid, next, data.shellCount)) {
        finishRef.current(true);
      } else if (movesRef.current >= moveLimit) {
        finishRef.current(false);
      } else if (!hasLegalMove(data.grid, next)) {
        finishRef.current(false);
      }
      return true;
    },
    [blink, data, moveLimit],
  );
  stepRef.current = commitStep;

  const tapCell = useCallback(
    (target: Pos) => {
      armRef.current();
      stepRef.current(target);
    },
    [],
  );

  const undo = useCallback(() => {
    if (doneRef.current || pathRef.current.length === 0) {
      return;
    }
    const next = undoStep(pathRef.current);
    pathRef.current = next;
    setPath(next);
    movesRef.current = Math.max(0, movesRef.current - 1);
    setMoves(movesRef.current);
    armRef.current();
  }, []);

  const reset = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    pathRef.current = [];
    setPath([]);
    movesRef.current = 0;
    setMoves(0);
    setErrorCell(null);
    armRef.current();
  }, []);

  const hint = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    const target = nextHintStep(data.grid, pathRef.current, data.solution);
    armRef.current();
    if (!target) {
      finishRef.current(false);
      return;
    }
    spendRef.current();
    stepRef.current(target);
  }, [data]);

  useEffect(() => {
    doneRef.current = false;
    pathRef.current = [];
    movesRef.current = 0;
    setPath([]);
    setMoves(0);
    setErrorCell(null);

    armAuto();
    idleRef.current = setTimeout(() => {
      finishRef.current(false);
    }, IDLE_BACKSTOP_MS);

    return clearTimers;
  }, [armAuto, clearTimers, level]);

  const head = path.length > 0 ? path[path.length - 1] : null;
  const nextNumber = nextShellNumber(data.grid, path);

  return {
    grid: data.grid,
    par: data.par,
    shellCount: data.shellCount,
    moveLimit,
    path,
    head,
    moves,
    errorCell,
    nextNumber,
    canUndo: path.length > 0,
    tapCell,
    undo,
    reset,
    hint,
  };
}
