import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { PressableScale } from './PressableScale';
import type { Essentiel } from '../data/content';

/** Navy "L'essentiel du jour" hero card — the single featured story. Tapping
 *  anywhere opens the source article. C'est la carte la plus grande de l'app :
 *  elle s'enfonce un peu plus que les autres, sinon le geste ne se voit pas. */
export function EssentielCard({ data, onOpen }: { data: Essentiel; onOpen: (url: string) => void }) {
  return (
    <PressableScale
      onPress={() => onOpen(data.url)}
      style={styles.card}
      scaleTo={0.96}
      haptic="light"
      accessibilityRole="link"
    >
      {({ pressed }) => (
        <>
          <Text style={styles.label}>{data.label}</Text>
          <Text style={[styles.title, pressed && styles.titlePressed]}>{data.title}</Text>
          <Text style={styles.dek}>{data.dek}</Text>
          <View style={styles.sourceRow}>
            <Text style={styles.source}>{data.source}</Text>
            <Text style={[styles.arrow, pressed && styles.titlePressed]}>↗</Text>
          </View>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: 19,
    padding: 19,
    shadowColor: colors.navy,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 13,
    elevation: 6,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.onNavyLabel,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 19,
    lineHeight: 24,
    color: colors.onNavy,
    marginTop: 12,
  },
  titlePressed: { color: colors.goldHover },
  dek: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onNavyDek,
    marginTop: 9,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
  },
  source: {
    fontFamily: fonts.regular,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.gold,
  },
  arrow: { fontSize: 12, color: colors.gold },
});
