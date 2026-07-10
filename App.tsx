import React, { useCallback, useEffect, useState } from 'react';
import { View, Linking, StyleSheet } from 'react-native';
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
  // the day's feed once it arrives. If the fetch fails, the fallback stands.
  const [content, setContent] = useState<DailyContent>(fallbackContent);

  const [fontsLoaded] = useFonts({
    Spectral_400Regular,
    Spectral_400Regular_Italic,
    Spectral_500Medium,
    Spectral_600SemiBold,
    Spectral_700Bold,
  });

  useEffect(() => {
    let alive = true;
    fetchDailyContent().then((c) => {
      if (alive && c) setContent(c);
    });
    return () => {
      alive = false;
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
