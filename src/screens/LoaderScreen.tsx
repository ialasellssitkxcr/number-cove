import React, { useEffect, useRef } from 'react';
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

import { bgLoader, spriteShellGold } from '../assets';
import { BubbleField, GlowBlobs } from '../components/Decor';
import { LOADER_DURATION_MS } from '../constants/config';
import { THEME } from '../constants/theme';

const { width: W, height: H } = Dimensions.get('window');
const BAR_W = 190;

type Props = {
  onDone: () => void;
};

/**
 * Deep-water brand card. Non-interactive by design: a wall-clock timer, not an
 * animation callback, hands control to the hub after LOADER_DURATION_MS.
 */
export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0.82)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(rise, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(bar, {
      toValue: BAR_W,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    }).start();

    const handoff = setTimeout(() => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      Animated.timing(out, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS);

    return () => clearTimeout(handoff);
  }, [bar, fade, onDone, out, rise]);

  return (
    <Animated.View style={[styles.root, { opacity: out }]}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.deep.d1} />
      <ImageBackground source={bgLoader} resizeMode="cover" style={styles.bg}>
        <LinearGradient
          colors={['rgba(6,43,61,0.94)', 'rgba(11,74,99,0.90)', 'rgba(14,107,134,0.86)']}
          style={styles.veil}
        />
        <GlowBlobs width={W} height={H} tint="#168AAD" />
        <BubbleField width={W} height={H} count={900} tint="#9DCEDB" seed={31} maxR={2.2} />

        <View style={styles.center}>
          <Animated.View
            style={[
              styles.mark,
              { opacity: fade, transform: [{ scale: rise }] },
            ]}>
            <Image source={spriteShellGold} style={styles.shell} resizeMode="contain" />
          </Animated.View>

          <Animated.View style={{ opacity: fade }}>
            <Text style={styles.brand}>NUMBER COVE</Text>
            <Text style={styles.tagline}>TRACE THE TIDE</Text>
          </Animated.View>

          <View style={styles.track}>
            <Animated.View style={[styles.barWrap, { width: bar }]}>
              <LinearGradient
                colors={[THEME.gradients.tide[1], THEME.gradients.tide[0]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.deep.d1,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mark: {
    width: 168,
    height: 168,
    borderRadius: 84,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(157,206,219,0.35)',
    shadowColor: '#00A6CB',
    shadowOpacity: 0.55,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    marginBottom: 30,
  },
  shell: {
    width: 132,
    height: 132,
  },
  brand: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 5,
    textAlign: 'center',
    color: THEME.colors.text.onDark,
    textShadowColor: 'rgba(0,166,203,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3.5,
    textAlign: 'center',
    color: THEME.colors.text.onDarkMuted,
  },
  track: {
    marginTop: 40,
    width: BAR_W,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(157,206,219,0.22)',
  },
  barWrap: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    flex: 1,
  },
  loading: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#7FB6C6',
  },
});
