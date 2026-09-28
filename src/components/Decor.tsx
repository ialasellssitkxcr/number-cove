import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type BubbleProps = {
  width: number;
  height: number;
  count?: number;
  tint?: string;
  seed?: number;
  maxR?: number;
};

function xorshift(seed: number): () => number {
  let x = seed || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 100000) / 100000;
  };
}

/**
 * Static plankton / bubble layer. Nothing animates here: it is a single dense
 * paint pass that also gives the frame enough texture to stay distinct.
 */
export function BubbleField({
  width,
  height,
  count = 240,
  tint = '#9DCEDB',
  seed = 7,
  maxR = 2.2,
}: BubbleProps) {
  const dots = useMemo(() => {
    const rnd = xorshift(seed * 2654435761);
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < count; i++) {
      out.push({
        x: Math.round(rnd() * width * 100) / 100,
        y: Math.round(rnd() * height * 100) / 100,
        r: Math.round((0.6 + rnd() * (maxR - 0.6)) * 100) / 100,
        o: Math.round((0.08 + rnd() * 0.24) * 100) / 100,
      });
    }
    return out;
  }, [count, height, maxR, seed, width]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        {dots.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={tint} opacity={d.o} />
        ))}
      </Svg>
    </View>
  );
}

type GlowProps = {
  width: number;
  height: number;
  tint?: string;
};

/** Three soft radial-ish blooms, used behind the loader mark. */
export function GlowBlobs({ width, height, tint = '#168AAD' }: GlowProps) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        <Circle cx={width * 0.22} cy={height * 0.18} r={width * 0.34} fill={tint} opacity={0.12} />
        <Circle cx={width * 0.84} cy={height * 0.42} r={width * 0.28} fill={tint} opacity={0.1} />
        <Circle cx={width * 0.5} cy={height * 0.88} r={width * 0.42} fill={tint} opacity={0.11} />
      </Svg>
    </View>
  );
}

type WaveProps = {
  width: number;
  height: number;
  tint?: string;
};

/** Three stacked foam curves along the bottom of the hub screen. */
export function WaveDecor({ width, height, tint = '#B8DBE5' }: WaveProps) {
  const w = width;
  const h = height;
  const curve = (offset: number) =>
    'M0 ' +
    (h * 0.35 + offset) +
    ' Q ' +
    w * 0.25 +
    ' ' +
    (h * 0.12 + offset) +
    ' ' +
    w * 0.5 +
    ' ' +
    (h * 0.36 + offset) +
    ' T ' +
    w +
    ' ' +
    (h * 0.34 + offset) +
    ' L ' +
    w +
    ' ' +
    h +
    ' L 0 ' +
    h +
    ' Z';

  return (
    <View pointerEvents="none" style={styles.waveWrap}>
      <Svg width={w} height={h}>
        <Path d={curve(0)} fill={tint} opacity={0.32} />
        <Path d={curve(h * 0.16)} fill={tint} opacity={0.26} />
        <Path d={curve(h * 0.32)} fill="#9DCEDB" opacity={0.22} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  waveWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
