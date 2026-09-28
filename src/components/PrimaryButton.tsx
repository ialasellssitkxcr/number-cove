import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: any;
  colors?: string[];
  height?: number;
  width?: number | string;
};

const ICON = 24;

/**
 * Gradient CTA. The touchable is the outer node and the animated container
 * lives inside it, so taps are never swallowed on Android release builds.
 */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  colors,
  height = 58,
  width = '100%',
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const tint = colors ?? [THEME.gradients.primary[0], THEME.gradients.primary[1]];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height, width: width as any }]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={tint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color="#FFFFFF" strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 22,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fill: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.colors.text.inverse,
  },
});
