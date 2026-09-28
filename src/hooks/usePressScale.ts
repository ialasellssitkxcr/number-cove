import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Press feedback driven from the touchable itself: the touchable stays the
 * parent, the animated container lives inside it, and only transform/opacity
 * ever run on the native driver.
 */
export function usePressScale(pressedScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
