import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, AccessibilityInfo, type ViewStyle } from 'react-native';

/**
 * Entrée en fondu, avec une légère montée — l'animation par défaut de l'app.
 *
 * `delay` sert à décaler les cartes d'une liste les unes après les autres : le
 * regard suit alors l'ordre de lecture au lieu de recevoir le bloc entier.
 *
 * Le réglage système « Réduire les animations » est respecté : le contenu
 * apparaît alors immédiatement, sans mouvement.
 */
export function FadeIn({
  children,
  delay = 0,
  distance = 14,
  duration = 420,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => alive && setReduceMotion(v))
      .catch(() => alive && setReduceMotion(false));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion === null) return; // on attend de savoir, sans clignoter
    if (reduceMotion) {
      anim.setValue(1);
      return;
    }
    const a = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [anim, delay, duration, reduceMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
