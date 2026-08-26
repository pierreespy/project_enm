import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/**
 * Masthead — the centered "PROJECT / ENM" monogram (logo direction 1f) with the
 * baseline "Veille juridique biquotidienne" and a date/label in the top-right corner.
 * Shared by both screens.
 */
export function Header({ cornerLabel }: { cornerLabel: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.corner}>{cornerLabel}</Text>
      <Text style={styles.project}>Project</Text>
      <Text style={styles.enm}>ENM</Text>
      <Text style={styles.baseline}>Veille juridique biquotidienne</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 2,
    paddingBottom: 17,
  },
  corner: {
    position: 'absolute',
    top: 6,
    right: 2,
    fontFamily: fonts.regular,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.mastheadDate,
  },
  project: {
    fontFamily: fonts.regular,
    fontSize: 8.5,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: colors.mastheadProject,
    marginLeft: 5,
  },
  enm: {
    fontFamily: fonts.bold,
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 1,
    // lineHeight ≥ fontSize × 1,25 : à hauteur égale au corps, la boîte de ligne
    // rogne le haut des capitales en Spectral gras. Le marginTop compense le
    // supplément d'interligne pour que le monogramme ne descende pas.
    lineHeight: 38,
    marginTop: -1,
  },
  baseline: {
    fontFamily: fonts.regular,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.navy,
    marginTop: 7,
  },
});
