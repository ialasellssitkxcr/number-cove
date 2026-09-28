import React from 'react';
import { Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  children: React.ReactNode;
  height: number;
  tone?: 'white' | 'accent' | 'soft';
  onPress?: () => void;
  style?: ViewStyle;
};

/** Soft-UI surface used for every bento block on the hub screen. */
export function BentoTile({ children, height, tone = 'white', onPress, style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const toneStyle =
    tone === 'accent' ? styles.accent : tone === 'soft' ? styles.soft : styles.white;

  if (!onPress) {
    return <View style={[styles.base, toneStyle, { height }, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      style={[styles.press, { height }, style]}>
      <Animated.View
        style={[styles.base, toneStyle, styles.grow, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
  },
  grow: {
    flex: 1,
  },
  base: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  white: {
    backgroundColor: THEME.colors.surface.card,
    borderColor: THEME.colors.border.card,
  },
  soft: {
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderColor: THEME.colors.border.soft,
  },
  accent: {
    backgroundColor: 'rgba(118,200,147,0.14)',
    borderColor: 'rgba(118,200,147,0.38)',
  },
});
