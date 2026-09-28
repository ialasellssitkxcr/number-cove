import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { THEME } from '../constants/theme';

type Props = {
  total: number;
  current: number;
  solvedCount: number;
  onSelect: (level: number) => void;
};

const DOT = 36;

/** Cove map: one tappable dot per level, unlocked up to solvedCount + 1. */
export function LevelDots({ total, current, solvedCount, onSelect }: Props) {
  const items: number[] = [];
  for (let i = 1; i <= total; i++) {
    items.push(i);
  }
  const unlockedUpTo = Math.min(total, solvedCount + 1);

  return (
    <View style={styles.row}>
      {items.map(n => {
        const done = n <= solvedCount;
        const active = n === current;
        const locked = n > unlockedUpTo;
        return (
          <Pressable
            key={n}
            onPress={() => {
              if (!locked) {
                onSelect(n);
              }
            }}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel={'Level ' + n}
            style={[
              styles.dot,
              done ? styles.done : null,
              active ? styles.active : null,
              locked ? styles.locked : null,
            ]}>
            {done && !active ? (
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
            ) : (
              <Text
                style={[
                  styles.num,
                  active ? styles.numActive : null,
                  locked ? styles.numLocked : null,
                ]}>
                {n}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.bg.mid,
    borderWidth: 1,
    borderColor: THEME.colors.border.card,
  },
  done: {
    backgroundColor: THEME.colors.accent.success,
    borderColor: THEME.colors.accent.success,
  },
  active: {
    backgroundColor: THEME.colors.accent.primary,
    borderWidth: 2,
    borderColor: THEME.colors.accent.sun,
  },
  locked: {
    backgroundColor: THEME.colors.rock.lockedBg,
    borderColor: THEME.colors.border.card,
  },
  num: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums' as const],
  },
  numActive: {
    color: THEME.colors.text.inverse,
  },
  numLocked: {
    color: THEME.colors.rock.locked,
  },
});
