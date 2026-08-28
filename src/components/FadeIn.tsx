import React, { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';
import { useReduceMotion } from '../hooks/useReduceMotion';

/**
 * Entrée en fondu, avec une légère montée — l'animation par défaut de l'app.
 *
 * `delay` sert à décaler les cartes d'une liste les unes après les autres : le
 * regard suit alors l'ordre de lecture au lieu de recevoir le bloc entier.
 *
 * Le contenu arrive aussi d'un cheveu trop petit (`scaleFrom`) : à ce dosage
 * l'œil ne voit pas un zoom, il voit le bloc se poser. Mettre 1 pour l'annuler.
 *
 * Le réglage système « Réduire les animations » est respecté : le contenu
 * apparaît alors immédiatement, sans mouvement.
 */
export function FadeIn({
  children,
  delay = 0,
  distance = 14,
  distanceX = 0,
  duration = 420,
  scaleFrom = 0.985,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  /** Montée d'entrée, en px. */
  distance?: number;
  /** Entrée latérale, en px — signée : négatif vient de la gauche. Sert aux
   *  changements d'onglet, où l'écran doit arriver du côté qu'on a quitté. */
  distanceX?: number;
  duration?: number;
  scaleFrom?: number;
  style?: ViewStyle;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();

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
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [distanceX, 0],
              }),
            },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [scaleFrom, 1],
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
