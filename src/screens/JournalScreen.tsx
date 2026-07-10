import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { EssentielCard } from '../components/EssentielCard';
import { RubriqueCard } from '../components/RubriqueCard';
import type { DailyContent } from '../data/content';

/** Screen 1 — Journal: masthead, "L'essentiel du jour" hero, then one card per
 *  rubrique. */
export function JournalScreen({
  content,
  onOpen,
}: {
  content: DailyContent;
  onOpen: (url: string) => void;
}) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header cornerLabel={content.dateShort} />

      <EssentielCard data={content.essentiel} onOpen={onOpen} />

      <View style={styles.list}>
        {content.rubriques.map((r, i) => (
          <RubriqueCard key={i} data={r} onOpen={onOpen} />
        ))}
      </View>
    </ScrollView>
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
