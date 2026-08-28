import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { FadeIn } from '../components/FadeIn';
import { ToggleButton } from '../components/ToggleButton';
import { colors, fonts } from '../theme';
import type { Mot } from '../data/content';

/** Screen 2 — Terme du jour: the term in large type on a navy card, a short
 *  definition, and a button that expands the full fiche. */
export function TermeScreen({ mot }: { mot: Mot }) {
  const [ficheOpen, setFicheOpen] = useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header cornerLabel="Terme" />

      <FadeIn>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{mot.label}</Text>
          <Text style={styles.term}>{mot.term}</Text>
          <Text style={styles.subtitle}>{mot.subtitle}</Text>
        </View>
      </FadeIn>

      <FadeIn delay={90}>
        <View style={styles.defCard}>
          <Text style={styles.defShort}>{mot.defShort}</Text>
        </View>
      </FadeIn>

      <ToggleButton
        open={ficheOpen}
        style={styles.toggle}
        label={ficheOpen ? 'Réduire la fiche' : 'Ouvrir la fiche complète'}
        onPress={() => setFicheOpen((v) => !v)}
      />

      {ficheOpen && (
        <View style={styles.fiche}>
          {mot.fiche.map((f, i) => (
            <FadeIn key={i} delay={i * 55} duration={320}>
              <View style={styles.ficheCard}>
                <Text style={styles.ficheH}>{f.h}</Text>
                <Text style={styles.ficheBody}>{f.body}</Text>
              </View>
            </FadeIn>
          ))}
          <FadeIn delay={mot.fiche.length * 55} duration={320}>
            <Text style={styles.seeAlso}>{mot.seeAlso}</Text>
          </FadeIn>
        </View>
      )}
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
  hero: {
    backgroundColor: colors.navy,
    borderRadius: 19,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: colors.navy,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 13,
    elevation: 6,
  },
  heroLabel: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.onNavyLabel,
  },
  term: {
    fontFamily: fonts.semibold,
    fontSize: 30,
    lineHeight: 34,
    color: colors.onNavy,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: fonts.italic,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: colors.onNavyDek,
    marginTop: 10,
  },
  defCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
    shadowColor: '#282112',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4.5,
    elevation: 1,
  },
  defShort: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkSoft,
  },
  toggle: { marginTop: 14 },
  fiche: {
    marginTop: 14,
    gap: 11,
  },
  ficheCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 15,
  },
  ficheH: {
    fontFamily: fonts.regular,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.navy,
  },
  ficheBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
    marginTop: 6,
  },
  seeAlso: {
    fontFamily: fonts.italic,
    fontStyle: 'italic',
    fontSize: 12,
    color: colors.summary,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});
