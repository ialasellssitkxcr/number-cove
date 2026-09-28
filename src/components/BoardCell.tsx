import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { spriteRock, spriteShell, spriteShellGold } from '../assets';
import { STEP_ANIM_MS } from '../constants/config';
import { THEME } from '../constants/theme';
import type { CellKind } from '../types';

type Props = {
  kind: CellKind;
  num?: number;
  size: number;
  inPath: boolean;
  isHead: boolean;
  isError: boolean;
  isFinal: boolean;
  isNext: boolean;
  onPress: () => void;
};

function CellView({
  kind,
  num,
  size,
  inPath,
  isHead,
  isError,
  isFinal,
  isNext,
  onPress,
}: Props) {
  const inner = size - 4;
  const fill = useRef(new Animated.Value(inPath ? 1 : 0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: inPath ? 1 : 0,
      duration: STEP_ANIM_MS,
      useNativeDriver: true,
    }).start();
  }, [fill, inPath]);

  useEffect(() => {
    if (!isHead) {
      return;
    }
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.04,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isHead, pulse]);

  const shellSrc = isFinal ? spriteShellGold : spriteShell;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.press, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.inner,
          { width: inner, height: inner, transform: [{ scale: pulse }] },
          kind === 'rock' ? styles.rock : styles.sand,
          isError ? styles.error : null,
          isHead ? styles.head : null,
          isNext && !inPath ? styles.nextTarget : null,
        ]}>
        {kind !== 'rock' ? (
          <Animated.View style={[styles.absFill, { opacity: fill }]}>
            <LinearGradient
              colors={[THEME.gradients.tide[0], THEME.gradients.tide[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.absFill}
            />
            <View style={styles.gloss} />
          </Animated.View>
        ) : null}

        {kind === 'rock' ? (
          <Image
            source={spriteRock}
            style={{ width: inner * 0.7, height: inner * 0.7 }}
            resizeMode="contain"
          />
        ) : null}

        {kind === 'shell' ? (
          <Image
            source={shellSrc}
            style={{ width: inner - 6, height: inner - 6 }}
            resizeMode="contain"
          />
        ) : null}

        {kind === 'shell' && num ? (
          <View style={[styles.badge, inPath ? styles.badgeOn : null]}>
            <Text style={[styles.badgeText, inPath ? styles.badgeTextOn : null]}>
              {num}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export const BoardCell = React.memo(CellView);

const styles = StyleSheet.create({
  press: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  sand: {
    backgroundColor: THEME.colors.surface.sand,
    borderColor: THEME.colors.border.sand,
  },
  rock: {
    backgroundColor: THEME.colors.rock.fill,
    borderColor: '#8AA3AD',
  },
  head: {
    borderWidth: 2,
    borderColor: THEME.colors.accent.sun,
  },
  nextTarget: {
    borderWidth: 2,
    borderColor: THEME.colors.accent.sun,
  },
  error: {
    backgroundColor: THEME.colors.accent.error,
    borderColor: THEME.colors.accent.error,
  },
  absFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  gloss: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  badge: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  badgeOn: {
    backgroundColor: THEME.colors.accent.primary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums' as const],
  },
  badgeTextOn: {
    color: THEME.colors.text.inverse,
  },
});
