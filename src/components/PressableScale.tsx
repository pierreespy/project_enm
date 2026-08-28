import React, { useRef } from 'react';
import { Animated, Pressable, type ViewStyle, type StyleProp } from 'react-native';

/**
 * Zone tappable qui s'enfonce sous le doigt.
 *
 * Le retour haptique seul ne suffit pas : sur une action qui quitte l'app —
 * ouvrir un article dans le navigateur — l'œil doit voir que le tap a été pris
 * en compte avant que l'écran ne bascule. D'où ce léger enfoncement, rendu au
 * doigt levé.
 */
export function PressableScale({
  children,
  onPress,
  style,
  scaleTo = 0.97,
  hitSlop,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hitSlop?: number;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const to = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
