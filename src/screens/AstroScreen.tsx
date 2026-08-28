import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { colors, fonts } from '../theme';
import { FadeIn } from '../components/FadeIn';
import { PressableScale } from '../components/PressableScale';
import { ToggleButton } from '../components/ToggleButton';
import { failure, soft, success, tap } from '../lib/haptics';
import { fetchAstroIndex, fetchAstroLesson } from '../data/remote';
import type { AstroIndexEntry, AstroLesson } from '../data/content';

/** Screen 3 — Astrophysique : le cours. Une leçon par jour, numérotée, qui part
 *  de zéro et s'appuie sur les précédentes. Mise en page reprise du Terme du
 *  jour (héros marine, cartes crème) pour rester dans l'identité.
 *
 *  Le sommaire donne accès à toutes les leçons passées : seule celle du jour
 *  voyage dans latest.json, les archives sont chargées à la demande. */
export function AstroScreen({ lesson }: { lesson?: AstroLesson }) {
  const scroll = useRef<ScrollView>(null);
  const [index, setIndex] = useState<AstroIndexEntry[] | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  // Leçon d'archive en cours de consultation ; null = la leçon du jour.
  const [archive, setArchive] = useState<AstroLesson | null>(null);
  const [loadingN, setLoadingN] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchAstroIndex().then((i) => {
      if (alive) setIndex(i);
    });
    return () => {
      alive = false;
    };
  }, []);

  const shown = archive ?? lesson;

  const open = useCallback(
    async (entry: AstroIndexEntry) => {
      tap();
      setTocOpen(false);
      setFailed(false);
      // La leçon du jour est déjà en mémoire — inutile de la retélécharger.
      if (lesson && entry.n === lesson.n) {
        setArchive(null);
        scroll.current?.scrollTo({ y: 0, animated: false });
        return;
      }
      setLoadingN(entry.n);
      const l = await fetchAstroLesson(entry.file);
      setLoadingN(null);
      if (!l) {
        failure();
        setFailed(true);
        return;
      }
      success(); // la leçon est là : la même boucle que la relève du Journal
      setArchive(l);
      scroll.current?.scrollTo({ y: 0, animated: false });
    },
    [lesson],
  );

  const backToToday = useCallback(() => {
    soft();
    setArchive(null);
    setFailed(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, []);

  if (!shown) {
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
      ref={scroll}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header cornerLabel={`Leçon ${shown.n}`} />

      <FadeIn>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>
          Cours d’astrophysique · Leçon {shown.n}
            {shown.duration ? ` · ${shown.duration}` : ''}
          </Text>
          <Text style={styles.title}>{shown.title}</Text>
          <Text style={styles.subtitle}>{shown.subtitle}</Text>
        </View>
      </FadeIn>

      {!!archive && lesson && archive.n !== lesson.n && (
        <PressableScale
          wrapperStyle={styles.spaced}
          style={styles.banner}
          onPress={backToToday}
          haptic="none"
          scaleTo={0.975}
          accessibilityRole="button"
        >
          <Text style={styles.bannerText}>
            Leçon passée — revenir à la leçon du jour (n° {lesson.n})
          </Text>
        </PressableScale>
      )}

      {!!index && index.length > 1 && (
        <>
          <ToggleButton
            open={tocOpen}
            style={styles.spaced}
            label={tocOpen ? 'Fermer le sommaire' : `Leçons précédentes (${index.length})`}
            onPress={() => setTocOpen((v) => !v)}
          />

          {tocOpen && (
            <View style={[styles.card, styles.spaced]}>
              {index.map((entry, i) => {
                const current = entry.n === shown.n;
                return (
                  // Le sommaire se déroule ligne à ligne, comme une liste qu'on
                  // parcourt — 28 ms suffisent, au-delà l'ouverture traîne.
                  <FadeIn key={entry.n} delay={i * 28} duration={260} distance={8}>
                    <Pressable
                      onPress={() => open(entry)}
                      style={({ pressed }) => [
                        styles.tocRow,
                        i > 0 && styles.tocRowBorder,
                        pressed && styles.tocRowPressed,
                      ]}
                    >
                      <Text style={[styles.tocN, current && styles.tocCurrent]}>
                        {String(entry.n).padStart(2, '0')}
                      </Text>
                      <Text style={[styles.tocTitle, current && styles.tocCurrent]} numberOfLines={2}>
                        {entry.title}
                      </Text>
                      {loadingN === entry.n && <ActivityIndicator size="small" color={colors.navy} />}
                    </Pressable>
                  </FadeIn>
                );
              })}
            </View>
          )}
        </>
      )}

      {failed && (
        <View style={[styles.card, styles.spaced]}>
          <Text style={styles.body}>
            Cette leçon n’a pas pu être chargée. Vérifiez votre connexion et réessayez
            depuis le sommaire.
          </Text>
        </View>
      )}

      {!!shown.intro && (
        <View style={styles.defCard}>
          <Text style={styles.intro}>{shown.intro}</Text>
        </View>
      )}

      <View style={styles.list}>
        {shown.sections.map((s, i) => (
          <FadeIn key={`${shown.n}-${i}`} delay={80 + i * 70}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{s.h}</Text>
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </FadeIn>
        ))}
      </View>

      {shown.keyTerms.length > 0 && (
        <View style={[styles.card, styles.spaced]}>
          <Text style={styles.cardLabel}>À retenir — vocabulaire</Text>
          {shown.keyTerms.map((t, i) => (
            <View key={i} style={i === 0 ? undefined : styles.termRow}>
              <Text style={styles.term}>{t.term}</Text>
              <Text style={styles.body}>{t.def}</Text>
            </View>
          ))}
        </View>
      )}

      <FadeIn delay={80 + shown.sections.length * 70}>
        <View style={styles.recapCard}>
          <Text style={styles.recapLabel}>En trois lignes</Text>
          <Text style={styles.recap}>{shown.recap}</Text>
        </View>
      </FadeIn>

      {!!shown.next && !archive && <Text style={styles.next}>{shown.next}</Text>}
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
  list: { marginTop: 12, gap: 12 },
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
  tocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  tocRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.cardDivider,
  },
  tocN: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.source,
    width: 24,
  },
  tocTitle: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  tocCurrent: { color: colors.navy },
  // La ligne s'éclaire sous le doigt : dans une liste dense, l'enfoncement
  // d'une carte entière serait illisible.
  tocRowPressed: { backgroundColor: '#f1eee5', borderRadius: 8 },
  banner: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: '#cdd6e2',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  bannerText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    letterSpacing: 0.2,
    color: colors.navy,
    textAlign: 'center',
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
