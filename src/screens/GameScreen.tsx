import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { bgGame } from '../assets';
import { ControlBar } from '../components/ControlBar';
import { CoveBoard } from '../components/CoveBoard';
import { Header } from '../components/Header';
import { BOARD_FRAME, COLS, ROWS } from '../constants/config';
import { THEME } from '../constants/theme';
import { useCoveGame } from '../hooks/useCoveGame';
import type { RoundResult } from '../types';

const { width: W, height: H } = Dimensions.get('window');

const HEADER_H = 116;
const DOCK_ZONE = 96;
const BOARD_MAX_W = Math.min(W - 32, 380);
const AVAIL_H = H - HEADER_H - DOCK_ZONE - 52;

const TILE = Math.max(
  28,
  Math.min(
    Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / COLS),
    Math.floor((AVAIL_H - 2 * BOARD_FRAME) / ROWS),
  ),
);

type Props = {
  level: number;
  onGameOver: (result: RoundResult) => void;
  onExit: () => void;
  onSpendPearl: () => void;
};

/** Floating-controls puzzle screen: the board owns the height, the dock floats. */
export function GameScreen({ level, onGameOver, onExit, onSpendPearl }: Props) {
  const game = useCoveGame({ level, onGameOver, onSpendPearl });
  const fade = useRef(new Animated.Value(0)).current;
  const movePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  useEffect(() => {
    if (game.moves === 0) {
      return;
    }
    Animated.sequence([
      Animated.timing(movePulse, {
        toValue: 1.12,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(movePulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [game.moves, movePulse]);

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.bg.base} />
      <ImageBackground source={bgGame} resizeMode="cover" style={styles.bg}>
        <LinearGradient
          colors={['rgba(240,250,249,0.70)', 'rgba(220,239,243,0.66)']}
          style={styles.veil}
        />

        <Header title={'LEVEL ' + level} subtitle={'TARGET ' + game.par + ' MOVES'}
          onBack={onExit}
          right={
            <Animated.View
              style={[styles.movesPill, { transform: [{ scale: movePulse }] }]}>
              <Text style={styles.movesText}>{game.moves}</Text>
            </Animated.View>
          }
        />

        <View style={styles.area}>
          <CoveBoard
            grid={game.grid}
            path={game.path}
            head={game.head}
            errorCell={game.errorCell}
            tile={TILE}
            shellCount={game.shellCount}
            nextNumber={game.nextNumber}
            onTapCell={game.tapCell}
          />

          <View style={styles.legend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>
              {'NEXT: ' + Math.min(game.nextNumber, game.shellCount)}
            </Text>
            <Text style={styles.legendMuted}>
              {'LIMIT ' + game.moveLimit}
            </Text>
          </View>
        </View>

        <ControlBar
          onUndo={game.undo}
          onHint={game.hint}
          onReset={game.reset}
          canUndo={game.canUndo}
        />
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.bg.base,
  },
  bg: {
    flex: 1,
  },
  veil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  movesPill: {
    height: 36,
    minWidth: 58,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,209,102,0.24)',
    borderWidth: 1,
    borderColor: THEME.colors.accent.sun,
  },
  movesText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums' as const],
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DOCK_ZONE,
  },
  legend: {
    marginTop: 14,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.accent.sun,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: THEME.colors.accent.primary,
  },
  legendMuted: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.muted,
  },
});
