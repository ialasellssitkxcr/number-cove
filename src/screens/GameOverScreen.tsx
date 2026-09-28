import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Map as MapIcon, RefreshCw } from 'lucide-react-native';

import { bgResult, spriteShellGold } from '../assets';
import { BubbleField } from '../components/Decor';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { THEME } from '../constants/theme';
import type { RoundResult } from '../types';

const { width: W, height: H } = Dimensions.get('window');
const CARD_W = Math.min(W - 48, 340);
const BUBBLES = 14;

type Props = {
  result: RoundResult;
  bestMoves: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

/** Round result. Titles are fixed literals the capture harness greps for. */
export function GameOverScreen({ result, bestMoves, onPlayAgain, onMenu }: Props) {
  const won = result.won;
  const pop = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0.9)).current;

  const bubbles = useRef(
    Array.from({ length: BUBBLES }, () => new Animated.Value(0)),
  ).current;

  const bubbleMeta = useMemo(
    () =>
      bubbles.map((_, i) => ({
        left: Math.round(((i * 37) % 100) * (W / 100)),
        size: 8 + ((i * 5) % 14),
      })),
    [bubbles],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pop, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(rise, {
        toValue: 1,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pop, rise]);

  useEffect(() => {
    if (!won) {
      return;
    }
    Animated.stagger(
      60,
      bubbles.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [bubbles, won]);

  const tint = won ? THEME.gradients.win : THEME.gradients.lose;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.bg.base} />
      <ImageBackground source={bgResult} resizeMode="cover" style={styles.bg}>
        <LinearGradient
          colors={[tint[0] + '', tint[1] + '', tint[2] + '']}
          style={[styles.veil, { opacity: 0.88 }]}
        />
        <BubbleField width={W} height={H} count={200} tint="#9DCEDB" seed={17} maxR={3} />

        {won ? (
          <View pointerEvents="none" style={styles.bubbleLayer}>
            {bubbles.map((v, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.bubble,
                  {
                    left: bubbleMeta[i].left,
                    width: bubbleMeta[i].size,
                    height: bubbleMeta[i].size,
                    borderRadius: bubbleMeta[i].size / 2,
                    opacity: v.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: v.interpolate({
                          inputRange: [0, 1],
                          outputRange: [120, -80],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        ) : null}

        <Header title={won ? 'ROUND CLEARED' : 'ROUND CLOSED'} subtitle="NUMBER COVE" tone="plain" />

        <View style={styles.body}>
          <Animated.View pointerEvents="box-none"
            style={[styles.card, { opacity: pop, transform: [{ scale: rise }] }]}>
            <Image source={spriteShellGold} style={styles.shell} resizeMode="contain" />

            <Text style={[styles.title, won ? styles.titleWin : styles.titleLose]}>
              {won ? 'YOU WON!' : 'NO LUCK!'}
            </Text>
            <Text style={styles.subtitle}>
              {won ? 'LEVEL ' + result.level + ' COMPLETE' : 'ROUTE UNFINISHED'}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  value={String(result.moves)}
                  label="MOVES"
                  accent={THEME.colors.accent.success}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  value={String(result.par)}
                  label="PAR"
                  accent={THEME.colors.accent.sun}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  value={bestMoves > 0 ? String(bestMoves) : '-'}
                  label="BEST"
                  accent={THEME.colors.accent.primary}
                />
              </View>
            </View>

            <View style={styles.ctaWrap}>
              <PrimaryButton label="PLAY AGAIN" onPress={onPlayAgain} Icon={RefreshCw} />
              <SecondaryButton label="COVE MAP" onPress={onMenu} Icon={MapIcon} />
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
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
  bubbleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Math.round(H * 0.6),
  },
  bubble: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    width: CARD_W,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 28,
    backgroundColor: THEME.colors.surface.card,
    borderWidth: 1,
    borderColor: THEME.colors.border.card,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  shell: {
    width: 96,
    height: 96,
    marginBottom: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  titleWin: {
    color: THEME.colors.text.leafDeep,
  },
  titleLose: {
    color: THEME.colors.text.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: THEME.colors.text.muted,
  },
  statsRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 8,
  },
  statSlot: {
    flex: 1,
  },
  ctaWrap: {
    marginTop: 22,
    alignSelf: 'stretch',
    gap: 12,
  },
});
