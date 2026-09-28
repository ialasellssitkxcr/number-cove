import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  HINT_COST,
  PERFECT_BONUS,
  START_PEARLS,
  TOTAL_LEVELS,
  WIN_REWARD,
} from './src/constants/config';
import { THEME } from './src/constants/theme';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import type { RoundResult, Screen } from './src/types';

/**
 * Screen state machine. Every round ends on a discrete gameover state so the
 * result is always a screen of its own, never an overlay on the board.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [pearls, setPearls] = useState(START_PEARLS);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [solved, setSolved] = useState(0);
  const [bestMoves, setBestMoves] = useState(0);
  const [round, setRound] = useState(0);
  const [lastResult, setLastResult] = useState<RoundResult>({
    won: false,
    moves: 0,
    par: 0,
    level: 1,
  });

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  const handlePlay = useCallback(() => {
    setRound(r => r + 1);
    setScreen('game');
  }, []);

  const handleSelectLevel = useCallback((level: number) => {
    setCurrentLevel(level);
  }, []);

  const handleSpendPearl = useCallback(() => {
    setPearls(p => (p >= HINT_COST ? p - HINT_COST : p));
  }, []);

  const handleExit = useCallback(() => setScreen('menu'), []);

  const handleGameOver = useCallback((result: RoundResult) => {
    setLastResult(result);
    if (result.won) {
      setSolved(s => Math.max(s, result.level));
      setBestMoves(b => (b === 0 ? result.moves : Math.min(b, result.moves)));
      setPearls(
        p => p + WIN_REWARD + (result.moves <= result.par ? PERFECT_BONUS : 0),
      );
      setCurrentLevel(l => Math.min(TOTAL_LEVELS, l + 1));
    }
    setScreen('gameover');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setRound(r => r + 1);
    setScreen('game');
  }, []);

  const handleMenu = useCallback(() => setScreen('menu'), []);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={handleLoaderDone} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          pearls={pearls}
          currentLevel={currentLevel}
          solved={solved}
          bestMoves={bestMoves}
          totalLevels={TOTAL_LEVELS}
          onPlay={handlePlay}
          onSelectLevel={handleSelectLevel}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'lvl' + currentLevel + '-' + round}
          level={currentLevel}
          onGameOver={handleGameOver}
          onExit={handleExit}
          onSpendPearl={handleSpendPearl}
        />
      ) : null}

      {screen === 'gameover' ? (
        <GameOverScreen
          result={lastResult}
          bestMoves={bestMoves}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.bg.base,
  },
});
