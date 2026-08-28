import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
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
 *  déclenche l'easter egg (voir hooks/useLongPullEasterEgg). */
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

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={egg.onScroll}
        onScrollEndDrag={egg.onRelease}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.navy}
          />
        }
      >
        <Header
          cornerLabel={
            content.slot ? `${content.dateShort} · ${content.slot}` : content.dateShort
          }
        />

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
      </ScrollView>

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
});
