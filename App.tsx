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
import { FadeIn } from './src/components/FadeIn';
import { light } from './src/lib/haptics';
import { TabBar, type Tab } from './src/components/TabBar';
import { JournalScreen } from './src/screens/JournalScreen';
import { TermeScreen } from './src/screens/TermeScreen';
import { AstroScreen } from './src/screens/AstroScreen';
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

  // Pull-to-refresh du Journal : même relève que ci-dessus, mais à la demande.
  // Le composant attend la promesse pour arrêter son indicateur.
  const refreshContent = useCallback(async () => {
    const c = await fetchDailyContent();
    if (c) setContent(c);
  }, []);

  const openUrl = useCallback((url: string) => {
    light();
    Linking.openURL(url).catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* La clé change avec l'onglet : chaque écran entre en fondu au lieu
          d'apparaître d'un bloc. */}
      <FadeIn key={tab} style={styles.screen} duration={260} distance={8}>
        {tab === 'journal' && (
          <JournalScreen content={content} onOpen={openUrl} onRefresh={refreshContent} />
        )}
        {tab === 'terme' && <TermeScreen mot={content.mot} />}
        {tab === 'astro' && <AstroScreen lesson={content.astro} />}
      </FadeIn>
      <TabBar tab={tab} onChange={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screen: { flex: 1 },
});
