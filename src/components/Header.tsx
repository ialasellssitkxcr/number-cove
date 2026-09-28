import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { THEME } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  tone?: 'plain' | 'veil';
};

/** Shared screen header. Reused on every screen so styling cannot drift. */
export function Header({ title, subtitle, onBack, right, tone = 'veil' }: Props) {
  return (
    <View style={[styles.wrap, tone === 'veil' ? styles.veil : null]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.back}>
          <ArrowLeft size={20} color={THEME.colors.accent.primary} strokeWidth={2.4} />
        </Pressable>
      ) : null}

      <View style={styles.titles}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  veil: {
    backgroundColor: THEME.colors.surface.veil,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.soft,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,138,173,0.10)',
  },
  titles: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: THEME.colors.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.colors.text.secondary,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
