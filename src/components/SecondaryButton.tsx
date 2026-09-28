import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: any;
};

const ICON = 24;

/** Tinted secondary action. Same icon metrics as the primary CTA. */
export function SecondaryButton({ label, onPress, Icon }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? (
            <Icon size={ICON} color={THEME.colors.accent.primary} strokeWidth={2.4} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
    borderRadius: 20,
  },
  fill: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,138,173,0.10)',
    borderWidth: 1,
    borderColor: THEME.colors.bg.deep,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.colors.accent.primary,
  },
});
