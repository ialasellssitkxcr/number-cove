import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play, Sun } from 'lucide-react-native';

import { bgMenu } from '../assets';
import { BentoTile } from '../components/BentoTile';
import { WaveDecor } from '../components/Decor';
import { Header } from '../components/Header';
import { LevelDots } from '../components/LevelDots';
import { StatCard } from '../components/StatCard';
import { COLS, ROWS } from '../constants/config';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const { width: W, height: H } = Dimensions.get('window');

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const AVAIL = H - 116 - 32;
const H_HERO = Math.round(clamp(AVAIL * 0.3, 150, 200));
const H_STATS = Math.round(clamp(AVAIL * 0.16, 88, 108));
const H_MAP = Math.round(clamp(AVAIL * 0.2, 112, 148));
const H_HINT = Math.round(clamp(AVAIL * 0.11, 60, 76));

type Props = {
  pearls: number;
  currentLevel: number;
  solved: number;
  bestMoves: number;
  totalLevels: number;
  onPlay: () => void;
  onSelectLevel: (level: number) => void;
};

type HeroProps = {
  level: number;
  onPress: () => void;
};

function HeroTile({ level, onPress }: HeroProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="PLAY NOW"
      style={[styles.heroPress, { height: H_HERO }]}>
      <Animated.View style={[styles.heroFill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[THEME.gradients.primary[0], THEME.gradients.primary[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroFill}>
          <View style={styles.heroRow}>
            <Play size={28} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.heroLabel}>PLAY NOW</Text>
          </View>
          <Text style={styles.heroSub}>
            {'LEVEL ' + level + ' · ' + COLS + 'x' + ROWS + ' GRID'}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

/** Bento hub: one big route CTA, live stats, the cove map and a how-to strip. */
export function MenuScreen({
  pearls,
  currentLevel,
  solved,
  bestMoves,
  totalLevels,
  onPlay,
  onSelectLevel,
}: Props) {
  const anim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.stagger(
      70,
      anim.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [anim]);

  const entry = useMemo(
    () =>
      anim.map(v => ({
        opacity: v,
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
      })),
    [anim],
  );

  const showStats = solved > 0 || bestMoves > 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.bg.base} />
      <ImageBackground source={bgMenu} resizeMode="cover" style={styles.bg}>
        <LinearGradient
          colors={['rgba(240,250,249,0.72)', 'rgba(217,238,243,0.60)', 'rgba(191,227,234,0.66)']}
          style={styles.veil}
        />
        <WaveDecor width={W} height={Math.round(H * 0.3)} tint="#B8DBE5" />

        <Header title="NUMBER COVE" subtitle="SUNLIT SHELL PUZZLE" tone="plain"
          right={
            <View style={styles.pearls}>
              <Sun size={20} color={THEME.colors.accent.sun} strokeWidth={2.4} />
              <Text style={styles.pearlsText}>{pearls}</Text>
            </View>
          }
        />

        <View style={styles.body}>
          <Animated.View pointerEvents="box-none"
            style={entry[0]}>
            <HeroTile level={currentLevel} onPress={onPlay} />
          </Animated.View>

          {showStats ? (
            <Animated.View pointerEvents="box-none"
              style={[styles.statsRow, entry[1]]}>
              <View style={styles.statSlot}>
                <StatCard
                  value={bestMoves > 0 ? String(bestMoves) : '-'}
                  label="BEST MOVES"
                  accent={THEME.colors.accent.sun}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  value={solved + '/' + totalLevels}
                  label="SOLVED"
                  accent={THEME.colors.accent.success}
                />
              </View>
            </Animated.View>
          ) : null}

          <Animated.View pointerEvents="box-none"
            style={entry[2]}>
            <BentoTile height={H_MAP} tone="soft" style={styles.mapTile}>
              <Text style={styles.mapTitle}>COVE MAP</Text>
              <LevelDots
                total={totalLevels}
                current={currentLevel}
                solvedCount={solved}
                onSelect={onSelectLevel}
              />
            </BentoTile>
          </Animated.View>

          <Animated.View pointerEvents="box-none"
            style={entry[3]}>
            <BentoTile height={H_HINT} tone="accent" style={styles.hintTile}>
              <Text style={styles.hintText}>
                TAP SHELL 1, THEN TAP NEIGHBOURS TO LINK 1-2-3
              </Text>
            </BentoTile>
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
  pearls: {
    height: 40,
    minWidth: 74,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: THEME.colors.bg.deep,
  },
  pearlsText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums' as const],
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    justifyContent: 'space-evenly',
  },
  heroPress: {
    width: '100%',
    borderRadius: 24,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
  heroFill: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  heroLabel: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.colors.text.inverse,
  },
  heroSub: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.88)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    height: H_STATS,
  },
  statSlot: {
    flex: 1,
    justifyContent: 'center',
  },
  mapTile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 14,
  },
  mapTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.colors.text.secondary,
  },
  hintTile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    color: THEME.colors.text.leafDeep,
  },
});
