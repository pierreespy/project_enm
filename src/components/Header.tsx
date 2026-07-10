import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/**
 * Masthead — the centered "PROJECT / ENM" monogram (logo direction 1f) with the
 * baseline "Veille juridique quotidienne" and a date/label in the top-right corner.
 * Shared by both screens.
 */
export function Header({ cornerLabel }: { cornerLabel: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.corner}>{cornerLabel}</Text>
      <Text style={styles.project}>Project</Text>
      <Text style={styles.enm}>ENM</Text>
      <Text style={styles.baseline}>Veille juridique quotidienne</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 2,
    paddingBottom: 20,
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
    lineHeight: 30,
    marginTop: 3,
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
