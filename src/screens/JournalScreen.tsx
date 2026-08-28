import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, View, StyleSheet, RefreshControl } from 'react-native';
import { Header } from '../components/Header';
import { EssentielCard } from '../components/EssentielCard';
import { RubriqueCard } from '../components/RubriqueCard';
import { IncomingCall } from '../components/IncomingCall';
import { FadeIn } from '../components/FadeIn';
import { medium, success } from '../lib/haptics';
import { useLongPullEasterEgg } from '../hooks/useLongPullEasterEgg';
import { colors } from '../theme';
import type { DailyContent } from '../data/content';

/** Screen 1 — Journal: masthead, "L'essentiel du jour" hero, then one card per
 *  rubrique. The masthead corner shows the edition's date and, since editions
 *  are published twice a day, which of the two ("matin" / "midi") is on screen —
 *  older archives carry no slot and show the date alone.
 *
 *  Tirer depuis le haut relève la boîte aux lettres ; tirer **longtemps**
 *  déclenche l'easter egg (voir hooks/useLongPullEasterEgg). Un filet marine se
 *  remplit en haut de l'écran pendant la tenue : le geste caché reste caché,
 *  mais celui qui le tente voit qu'il tient quelque chose. */
export function JournalScreen({
  content,
  onOpen,
  onRefresh,
}: {
  content: DailyContent;
  onOpen: (url: string) => void;
  onRefresh?: () => Promise<unknown> | void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const egg = useLongPullEasterEgg();
  const { onRefreshTriggered } = egg;

  // Position de défilement — sert la parallaxe du bandeau, en piste native.
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleRefresh = useCallback(async () => {
    onRefreshTriggered();
    medium();
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
      success(); // le contenu est relevé : la boucle se referme sous le doigt
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, onRefreshTriggered]);

  // Le scroll est écouté deux fois : par le pilote natif pour la parallaxe, et
  // par l'easter egg côté JS, qui a besoin de la valeur à chaque image.
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: egg.onScroll,
      }),
    [egg.onScroll, scrollY],
  );

  // Le bandeau monte moins vite que le contenu et s'efface : la page prend de
  // la profondeur, et la lecture gagne les quelques lignes du haut.
  const mastheadStyle = {
    opacity: scrollY.interpolate({
      inputRange: [0, 60, 130],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp' as const,
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [-120, 0, 200],
          // Négatif à l'overscroll : le bandeau suit le tirage, en retrait.
          outputRange: [26, 0, 60],
          extrapolate: 'clamp' as const,
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-120, 0],
          outputRange: [1.06, 1],
          extrapolate: 'clamp' as const,
        }),
      },
    ],
  };

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollEndDrag={egg.onRelease}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.navy}
          />
        }
      >
        <Animated.View style={mastheadStyle}>
          <Header
            cornerLabel={
              content.slot ? `${content.dateShort} · ${content.slot}` : content.dateShort
            }
          />
        </Animated.View>

        <FadeIn>
          <EssentielCard data={content.essentiel} onOpen={onOpen} />
        </FadeIn>

        <View style={styles.list}>
          {content.rubriques.map((r, i) => (
            // Cascade de 60 ms : les rubriques se posent dans l'ordre de lecture.
            <FadeIn key={i} delay={80 + i * 60}>
              <RubriqueCard data={r} onOpen={onOpen} />
            </FadeIn>
          ))}
        </View>
      </Animated.ScrollView>

      {/* La jauge du tirage long. Hors du ScrollView : elle doit rester collée
          au haut de l'écran pendant que le contenu, lui, descend. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.charge,
          {
            opacity: egg.charge.interpolate({
              inputRange: [0, 0.05, 1],
              outputRange: [0, 0.5, 1],
            }),
            width: egg.charge.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />

      <IncomingCall visible={egg.visible} onDismiss={egg.dismiss} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 122,
  },
  list: {
    marginTop: 16,
    gap: 12,
  },
  charge: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2.5,
    backgroundColor: colors.navy,
  },
});
