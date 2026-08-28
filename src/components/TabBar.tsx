import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { JournalIcon, ScaleIcon, AstroIcon } from './icons';
import { tap } from '../lib/haptics';

export type Tab = 'journal' | 'terme' | 'astro';

/** Floating navy pill tab bar with the active tab in full white and the others
 *  dimmed. Trois onglets : Journal (page), Terme du jour (balance) et
 *  Astrophysique (planète) — le cours quotidien. */
/** Un onglet. L'icône active grossit légèrement — assez pour marquer la
 *  sélection, trop peu pour attirer l'œil pendant la lecture. */
function TabButton({
  active,
  label,
  icon,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: (color: string) => React.ReactNode;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [active, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] });
  const color = active ? colors.tabActive : colors.tabInactive;

  return (
    <Pressable style={styles.btn} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Animated.View style={{ transform: [{ scale }] }}>{icon(color)}</Animated.View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  // Le retour haptique n'a lieu que sur un vrai changement : retaper l'onglet
  // courant ne doit rien produire.
  const select = (next: Tab) => {
    if (next === tab) return;
    tap();
    onChange(next);
  };

  return (
    <View style={styles.bar}>
      <TabButton
        active={tab === 'journal'}
        label="Journal"
        icon={(c) => <JournalIcon color={c} />}
        onPress={() => select('journal')}
      />
      <TabButton
        active={tab === 'terme'}
        label="Terme du jour"
        icon={(c) => <ScaleIcon color={c} />}
        onPress={() => select('terme')}
      />
      <TabButton
        active={tab === 'astro'}
        label="Astrophysique"
        icon={(c) => <AstroIcon color={c} />}
        onPress={() => select('astro')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 26,
    flexDirection: 'row',
    backgroundColor: colors.navySurface,
    borderRadius: 999,
    padding: 6,
    shadowColor: colors.navy,
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    letterSpacing: 0.2,
  },
});
