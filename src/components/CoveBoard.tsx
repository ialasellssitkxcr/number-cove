import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BOARD_FRAME, COLS, PAD, ROWS } from '../constants/config';
import { THEME } from '../constants/theme';
import { samePos } from '../game/rules';
import type { Cell, Pos } from '../types';
import { BoardCell } from './BoardCell';

type Props = {
  grid: Cell[][];
  path: Pos[];
  head: Pos | null;
  errorCell: Pos | null;
  tile: number;
  shellCount: number;
  nextNumber: number;
  onTapCell: (p: Pos) => void;
};

/**
 * Board frame maths: the parent padding + border are subtracted before the
 * tile size is floored, so the grid can never overflow its own card.
 */
export function CoveBoard({
  grid,
  path,
  head,
  errorCell,
  tile,
  shellCount,
  nextNumber,
  onTapCell,
}: Props) {
  const boardW = tile * COLS + 2 * BOARD_FRAME;
  const boardH = tile * ROWS + 2 * BOARD_FRAME;

  return (
    <View style={[styles.card, { width: boardW, height: boardH }]}>
      {grid.map((row, r) => (
        <View key={'r' + r} style={styles.row}>
          {row.map((cell, c) => {
            const pos = { r, c };
            const onPath = path.some(p => samePos(p, pos));
            return (
              <BoardCell
                key={'c' + r + '-' + c}
                kind={cell.kind}
                num={cell.num}
                size={tile}
                inPath={onPath}
                isHead={head ? samePos(head, pos) : false}
                isError={errorCell ? samePos(errorCell, pos) : false}
                isFinal={cell.kind === 'shell' && cell.num === shellCount}
                isNext={cell.kind === 'shell' && cell.num === nextNumber}
                onPress={() => onTapCell(pos)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: PAD,
    borderWidth: 2,
    borderColor: THEME.colors.bg.deep,
    borderRadius: 24,
    backgroundColor: THEME.colors.surface.card,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
});
