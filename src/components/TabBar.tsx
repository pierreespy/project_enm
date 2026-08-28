import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { JournalIcon, ScaleIcon, AstroIcon } from './icons';
import { tap } from '../lib/haptics';
import { useReduceMotion } from '../hooks/useReduceMotion';

export type Tab = 'journal' | 'terme' | 'astro';

const TABS: { key: Tab; label: string; icon: (color: string) => React.ReactNode }[] = [
  { key: 'journal', label: 'Journal', icon: (c) => <JournalIcon color={c} /> },
  { key: 'terme', label: 'Terme du jour', icon: (c) => <ScaleIcon color={c} /> },
  { key: 'astro', label: 'Astrophysique', icon: (c) => <AstroIcon color={c} /> },
];

const PADDING = 6; // le liseré marine autour de la pastille

/** Un onglet. À la sélection, l'icône bondit — elle dépasse brièvement sa
 *  taille finale avant de se poser — et le libellé se densifie. Assez pour
 *  marquer le changement, trop peu pour attirer l'œil pendant la lecture. */
function TabButton({
  active,
  label,
  icon,
  onPress,
  still,
}: {
  active: boolean;
  label: string;
  icon: (color: string) => React.ReactNode;
  onPress: () => void;
  still: boolean;
}) {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current;
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (still) {
      anim.setValue(active ? 1 : 0);
      return;
    }
    Animated.spring(anim, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      speed: 16,
      bounciness: 14,
    }).start();
  }, [active, anim, still]);

  // Le doigt enfonce l'onglet ; le ressort de sélection continue par-dessus.
  const scale = Animated.multiply(
    anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }),
    press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }),
  );
  const color = active ? colors.tabActive : colors.tabInactive;

  return (
    <Pressable
      style={styles.btn}
      onPress={onPress}
      onPressIn={() =>
        !still &&
        Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 45, bounciness: 0 }).start()
      }
      onPressOut={() =>
        !still &&
        Animated.spring(press, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 12 }).start()
      }
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={{
          transform: [
            { scale },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -1.5] }) },
          ],
        }}
      >
        {icon(color)}
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          { color, opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }) },
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

/** Floating navy pill tab bar. Une pastille claire glisse sous l'onglet actif :
 *  c'est elle qui porte le déplacement, les onglets ne font que réagir. */
export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const [barWidth, setBarWidth] = useState(0);
  const index = TABS.findIndex((t) => t.key === tab);
  const slide = useRef(new Animated.Value(index)).current;
  const still = useReduceMotion() === true;

  useEffect(() => {
    if (still) {
      slide.setValue(index);
      return;
    }
    Animated.spring(slide, {
      toValue: index,
      useNativeDriver: true,
      speed: 15,
      bounciness: 9,
    }).start();
  }, [index, slide, still]);

  // Le retour haptique n'a lieu que sur un vrai changement : retaper l'onglet
  // courant ne doit rien produire.
  const select = (next: Tab) => {
    if (next === tab) return;
    tap();
    onChange(next);
  };

  const slot = barWidth > 0 ? (barWidth - PADDING * 2) / TABS.length : 0;

  return (
    <View style={styles.bar} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
      {slot > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              width: slot,
              transform: [
                {
                  translateX: slide.interpolate({
                    inputRange: TABS.map((_, i) => i),
                    outputRange: TABS.map((_, i) => i * slot),
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {TABS.map((t) => (
        <TabButton
          key={t.key}
          active={t.key === tab}
          label={t.label}
          icon={t.icon}
          still={still}
          onPress={() => select(t.key)}
        />
      ))}
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
    padding: PADDING,
    shadowColor: colors.navy,
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 8,
  },
  // Posée en absolu dans la barre : elle glisse indépendamment des onglets, qui
  // gardent leur place. `top/bottom` la calent sur la hauteur d'un onglet.
  pill: {
    position: 'absolute',
    left: PADDING,
    top: PADDING,
    bottom: PADDING,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.13)',
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
