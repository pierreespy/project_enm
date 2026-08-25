import React, { useCallback, useEffect, useState } from 'react';
import { View, Linking, StyleSheet, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Spectral_400Regular,
  Spectral_400Regular_Italic,
  Spectral_500Medium,
  Spectral_600SemiBold,
  Spectral_700Bold,
} from '@expo-google-fonts/spectral';

import { colors } from './src/theme';
import { TabBar, type Tab } from './src/components/TabBar';
import { JournalScreen } from './src/screens/JournalScreen';
import { TermeScreen } from './src/screens/TermeScreen';
import { fetchDailyContent, fallbackContent, type DailyContent } from './src/data/remote';

export default function App() {
  const [tab, setTab] = useState<Tab>('journal');

  // Start from the bundled fallback so the app renders instantly, then swap in
  // the feed once it arrives. If the fetch fails, the fallback stands.
  const [content, setContent] = useState<DailyContent>(fallbackContent);

  const [fontsLoaded] = useFonts({
    Spectral_400Regular,
    Spectral_400Regular_Italic,
    Spectral_500Medium,
    Spectral_600SemiBold,
    Spectral_700Bold,
  });

  // Fetch at startup, then again every time the app comes back to the
  // foreground: two editions are published each day (matin / midi), so an app
  // left open in the morning would otherwise keep showing a stale edition.
  useEffect(() => {
    let alive = true;

    const refresh = () => {
      fetchDailyContent().then((c) => {
        if (alive && c) setContent(c);
      });
    };

    refresh();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const openUrl = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {tab === 'journal' ? (
        <JournalScreen content={content} onOpen={openUrl} />
      ) : (
        <TermeScreen mot={content.mot} />
      )}
      <TabBar tab={tab} onChange={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
