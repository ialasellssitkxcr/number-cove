import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RotateCcw, Sparkles, Undo2 } from 'lucide-react-native';

import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;
  canUndo: boolean;
};

const ICON = 24;

type RoundProps = {
  label: string;
  Icon: any;
  tint: string;
  bg: string;
  onPress: () => void;
  dimmed?: boolean;
};

function RoundAction({ label, Icon, tint, bg, onPress, dimmed }: RoundProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.roundPress}>
      <Animated.View
        style={[
          styles.roundFill,
          { backgroundColor: bg, transform: [{ scale }] },
          dimmed ? styles.dimmed : null,
        ]}>
        <Icon size={ICON} color={tint} strokeWidth={2.4} />
      </Animated.View>
    </Pressable>
  );
}

/** Floating control dock. GO advances the route by one guided step. */
export function ControlBar({ onUndo, onHint, onReset, canUndo }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <View style={styles.bar}>
      <RoundAction
        label="UNDO"
        Icon={Undo2}
        tint={THEME.colors.accent.primary}
        bg="rgba(24,138,173,0.10)"
        onPress={onUndo}
        dimmed={!canUndo}
      />

      <Pressable
        onPress={onHint}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="GO"
        style={styles.goPress}>
        <Animated.View style={[styles.goFill, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={[THEME.gradients.primary[0], THEME.gradients.primary[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goFill}>
            <View style={styles.row}>
              <Sparkles size={ICON} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.goLabel}>GO</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      <RoundAction
        label="RESET"
        Icon={RotateCcw}
        tint={THEME.colors.accent.sunDeep}
        bg="rgba(255,209,102,0.22)"
        onPress={onReset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: THEME.colors.border.soft,
    shadowColor: THEME.colors.accent.primary,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  },
  roundPress: {
    width: 52,
    height: 48,
  },
  roundFill: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.45,
  },
  goPress: {
    width: 136,
    height: 48,
  },
  goFill: {
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
  goLabel: {
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.colors.text.inverse,
  },
});
