import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { light, tap, tick, soft, medium } from '../lib/haptics';
import { useReduceMotion } from '../hooks/useReduceMotion';

const HAPTIC = { none: () => {}, tick, soft, light, medium, tap } as const;

export type PressHaptic = keyof typeof HAPTIC;

/**
 * Le geste de pression de l'app : la surface s'enfonce, et le doigt le sent.
 *
 * Deux ressorts distincts, et c'est volontaire — l'enfoncement est immédiat
 * (rigide, sans rebond) pour coller au doigt, la remontée rebondit légèrement
 * pour donner la matière. Une seule animation symétrique paraît molle.
 *
 * L'haptique part **à l'appui**, pas au relâchement : c'est ce qui donne
 * l'impression que le bouton répond, plutôt que d'accuser réception.
 */
export function PressableScale({
  children,
  onPress,
  scaleTo = 0.97,
  haptic = 'light',
  style,
  wrapperStyle,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & {
  children: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
  onPress?: () => void;
  scaleTo?: number;
  haptic?: PressHaptic;
  /** Style de la surface pressée — c'est elle qui porte le décor de la carte. */
  style?: StyleProp<ViewStyle>;
  /** Style du conteneur animé — pour un `flex` ou une marge qui doit rester
   *  hors de la mise à l'échelle. */
  wrapperStyle?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  // Mouvement coupé, retour haptique gardé : c'est lui qui dit « c'est pressé »
  // quand l'enfoncement ne se voit plus.
  const still = useReduceMotion() === true;

  const pressIn = useCallback(() => {
    HAPTIC[haptic]();
    if (still) return;
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  }, [haptic, scale, scaleTo, still]);

  const pressOut = useCallback(() => {
    if (still) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 11,
    }).start();
  }, [scale, still]);

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        style={style}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        {...rest}
      >
        {children as PressableProps['children']}
      </Pressable>
    </Animated.View>
  );
}
