import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { colors, fonts } from '../theme';
import type { AstroLesson } from '../data/content';

/** Screen 3 — Astrophysique : le cours du jour. Une leçon par jour, numérotée,
 *  qui part de zéro et s'appuie sur les précédentes. Mise en page reprise du
 *  Terme du jour (héros marine, cartes crème) pour rester dans l'identité. */
export function AstroScreen({ lesson }: { lesson?: AstroLesson }) {
  if (!lesson) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Header cornerLabel="Astro" />
        <View style={styles.defCard}>
          <Text style={styles.body}>
            La leçon du jour n’a pas pu être relevée. Elle s’affichera dès que le flux
            sera de nouveau accessible.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header cornerLabel={`Leçon ${lesson.n}`} />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>
          Cours d’astrophysique · Leçon {lesson.n}
          {lesson.duration ? ` · ${lesson.duration}` : ''}
        </Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>
      </View>

      <View style={styles.defCard}>
        <Text style={styles.intro}>{lesson.intro}</Text>
      </View>

      <View style={styles.list}>
        {lesson.sections.map((s, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{s.h}</Text>
            <Text style={styles.body}>{s.body}</Text>
          </View>
        ))}
      </View>

      {lesson.keyTerms.length > 0 && (
        <View style={[styles.card, styles.spaced]}>
          <Text style={styles.cardLabel}>À retenir — vocabulaire</Text>
          {lesson.keyTerms.map((t, i) => (
            <View key={i} style={i === 0 ? undefined : styles.termRow}>
              <Text style={styles.term}>{t.term}</Text>
              <Text style={styles.body}>{t.def}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.recapCard}>
        <Text style={styles.recapLabel}>En trois lignes</Text>
        <Text style={styles.recap}>{lesson.recap}</Text>
      </View>

      {!!lesson.next && <Text style={styles.next}>{lesson.next}</Text>}
    </ScrollView>
  );
}

const cardShadow = {
  shadowColor: '#282112',
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4.5,
  elevation: 1,
};

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
  title: {
    fontFamily: fonts.semibold,
    fontSize: 25,
    lineHeight: 30,
    color: colors.onNavy,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: fonts.italic,
    fontStyle: 'italic',
    fontSize: 12.5,
    lineHeight: 18,
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
    ...cardShadow,
  },
  intro: {
    fontFamily: fonts.italic,
    fontStyle: 'italic',
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.inkSoft,
  },
  list: { marginTop: 14, gap: 12 },
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 18,
    ...cardShadow,
  },
  spaced: { marginTop: 12 },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.ink,
    marginBottom: 8,
  },
  cardLabel: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.source,
    marginBottom: 12,
  },
  termRow: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardDivider,
    paddingTop: 14,
  },
  term: {
    fontFamily: fonts.semibold,
    fontSize: 14.5,
    color: colors.navy,
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.inkSoft,
  },
  recapCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    shadowColor: colors.navy,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 4,
  },
  recapLabel: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.onNavyLabel,
    marginBottom: 8,
  },
  recap: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.onNavy,
  },
  next: {
    fontFamily: fonts.italic,
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 19,
    color: colors.source,
    marginTop: 16,
    textAlign: 'center',
  },
});
