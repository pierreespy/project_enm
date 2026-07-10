import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
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

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>{mot.label}</Text>
        <Text style={styles.term}>{mot.term}</Text>
        <Text style={styles.subtitle}>{mot.subtitle}</Text>
      </View>

      <View style={styles.defCard}>
        <Text style={styles.defShort}>{mot.defShort}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => setFicheOpen((v) => !v)}>
        <Text style={styles.buttonSign}>{ficheOpen ? '–' : '+'}</Text>
        <Text style={styles.buttonLabel}>
          {ficheOpen ? 'Réduire la fiche' : 'Ouvrir la fiche complète'}
        </Text>
      </Pressable>

      {ficheOpen && (
        <View style={styles.fiche}>
          {mot.fiche.map((f, i) => (
            <View key={i} style={styles.ficheCard}>
              <Text style={styles.ficheH}>{f.h}</Text>
              <Text style={styles.ficheBody}>{f.body}</Text>
            </View>
          ))}
          <Text style={styles.seeAlso}>{mot.seeAlso}</Text>
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
  button: {
    width: '100%',
    marginTop: 14,
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
  buttonSign: {
    fontFamily: fonts.regular,
    fontSize: 19,
    lineHeight: 19,
    color: colors.navy,
  },
  buttonLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.navy,
  },
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
