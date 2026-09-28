import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '../constants/theme';

type Props = {
  value: string;
  label: string;
  accent: string;
};

/**
 * One stat pill, identical on the hub and the result screen. Colour carries the
 * semantics; there are no raster icons, so every pill in a row matches exactly.
 */
export function StatCard({ value, label, accent }: Props) {
  return (
    <View style={[styles.card, { borderColor: accent + '55' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: THEME.colors.surface.card,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums' as const],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.colors.text.muted,
  },
});
