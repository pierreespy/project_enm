import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { JournalIcon, ScaleIcon } from './icons';

export type Tab = 'journal' | 'terme';

/** Floating navy pill tab bar with the active tab in full white and the
 *  inactive one dimmed. Two tabs: Journal (page) and Terme du jour (scales). */
export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <View style={styles.bar}>
      <Pressable style={styles.btn} onPress={() => onChange('journal')}>
        <JournalIcon color={tab === 'journal' ? colors.tabActive : colors.tabInactive} />
        <Text style={[styles.label, { color: tab === 'journal' ? colors.tabActive : colors.tabInactive }]}>
          Journal
        </Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={() => onChange('terme')}>
        <ScaleIcon color={tab === 'terme' ? colors.tabActive : colors.tabInactive} />
        <Text style={[styles.label, { color: tab === 'terme' ? colors.tabActive : colors.tabInactive }]}>
          Terme du jour
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 60,
    right: 60,
    bottom: 26,
    flexDirection: 'row',
    backgroundColor: colors.navySurface,
    borderRadius: 999,
    padding: 6,
    shadowColor: colors.navy,
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 10,
    letterSpacing: 0.4,
  },
});
