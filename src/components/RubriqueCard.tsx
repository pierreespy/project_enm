import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { PressableScale } from './PressableScale';
import type { Rubrique } from '../data/content';

/** White card for one rubrique: a colour-tinted category chip, a title, a
 *  one-line summary, and a source row with a round ↗ button.
 *
 *  Toute la carte est la cible : viser le titre ou la flèche demandait de la
 *  précision, et l'enfoncement d'ensemble dit mieux que la carte entière part
 *  vers l'article. Le bouton rond reste, comme signe. */
export function RubriqueCard({ data, onOpen }: { data: Rubrique; onOpen: (url: string) => void }) {
  return (
    <PressableScale
      onPress={() => onOpen(data.url)}
      style={styles.card}
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={`${data.chip} — ${data.title}`}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.chip, { backgroundColor: data.tint }]}>
            <Text style={[styles.chipText, { color: data.ink }]}>{data.chip}</Text>
          </View>

          <Text style={[styles.title, pressed && styles.titlePressed]}>{data.title}</Text>

          <Text style={styles.summary}>{data.summary}</Text>

          <View style={styles.footer}>
            <Text style={styles.source}>{data.source}</Text>
            <View style={[styles.arrowBtn, pressed && styles.arrowBtnPressed]}>
              <Text style={[styles.arrow, pressed && styles.arrowPressed]}>↗</Text>
            </View>
          </View>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 15,
    gap: 8,
    shadowColor: '#282112',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4.5,
    elevation: 1,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 9.5,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.ink,
  },
  titlePressed: { color: colors.navy },
  summary: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.summary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardDivider,
  },
  source: {
    fontFamily: fonts.regular,
    fontSize: 11,
    letterSpacing: 0.3,
    color: colors.source,
  },
  arrowBtn: {
    width: 27,
    height: 27,
    borderRadius: 999,
    backgroundColor: colors.arrowBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnPressed: { backgroundColor: colors.navy },
  arrow: { fontSize: 13, color: colors.navy },
  arrowPressed: { color: colors.cardBg },
});
