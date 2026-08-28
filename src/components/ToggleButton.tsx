import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';
import { PressableScale } from './Press';

/**
 * Le bouton « ouvrir / réduire » du Terme du jour et du sommaire d'Astro —
 * même dessin des deux côtés, donc même composant.
 *
 * Le signe ne saute pas d'un glyphe à l'autre : c'est toujours un « + », qui
 * pivote d'un huitième de tour pour devenir une croix. Le mouvement dit le
 * repli aussi bien que le dépliage, là où deux glyphes qui se remplacent ne
 * disent rien. Le libellé, lui, change d'un coup — un texte en fondu se lit mal.
 *
 * L'haptique suit la même logique : ouvrir claque, refermer est mat.
 */
export function ToggleButton({
  open,
  label,
  onPress,
  style,
}: {
  open: boolean;
  label: string;
  onPress: () => void;
  /** Marges du bouton dans la page — le décor, lui, appartient au composant. */
  style?: StyleProp<ViewStyle>;
}) {
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 12,
    }).start();
  }, [anim, open]);

  return (
    <PressableScale
      wrapperStyle={style}
      style={styles.button}
      onPress={onPress}
      haptic={open ? 'soft' : 'light'}
      scaleTo={0.975}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      <Animated.Text
        style={[
          styles.sign,
          {
            transform: [
              {
                rotate: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          },
        ]}
      >
        +
      </Animated.Text>
      <Text style={styles.label}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: '#cdd6e2',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#282112',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4.5,
    elevation: 1,
  },
  sign: {
    fontFamily: fonts.regular,
    fontSize: 19,
    lineHeight: 19,
    color: colors.navy,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.navy,
  },
});
