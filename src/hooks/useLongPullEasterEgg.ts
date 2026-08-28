import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { heavy, light, tick } from '../lib/haptics';

/**
 * Easter egg — "tirer longtemps depuis le haut".
 *
 * Un tirage normal déclenche le rafraîchissement habituel. Si l'utilisateur
 * continue à tirer au-delà de `threshold` px et **maintient** ce tirage pendant
 * `holdMs`, on ouvre l'appel entrant (voir components/IncomingCall).
 *
 * Le geste se raconte sous le doigt : une petite butée quand on franchit le
 * seuil, puis des crans qui s'accélèrent pendant la tenue, et un coup franc au
 * déclenchement. `charge` (0 → 1) expose la même montée à l'écran — le Journal
 * s'en sert pour tracer un filet qui se remplit.
 *
 * iOS renvoie un `contentOffset.y` négatif pendant l'overscroll, ce qui donne
 * la mesure exacte du tirage. Android, lui, ne dépasse pas 0 (l'overscroll y est
 * un effet visuel), d'où le repli : trois rafraîchissements en moins de 8 s.
 */
export function useLongPullEasterEgg({
  threshold = 150,
  holdMs = 900,
  repeatCount = 3,
  repeatWindowMs = 8000,
}: {
  threshold?: number;
  holdMs?: number;
  repeatCount?: number;
  repeatWindowMs?: number;
} = {}) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticks = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pulls = useRef<number[]>([]);
  // Vrai dès que le tirage a dépassé le seuil, remis à faux au relâchement :
  // évite de rejouer la butée à chaque événement de scroll.
  const armed = useRef(false);
  // L'appel est à l'écran : le Journal continue de rapporter des événements de
  // scroll derrière la modale, il ne faut pas relancer une tenue par-dessus.
  const open = useRef(false);
  const charge = useRef(new Animated.Value(0)).current;

  const cancelHold = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    ticks.current.forEach(clearTimeout);
    ticks.current = [];
    armed.current = false;
    // Le filet retombe vite, mais pas d'un coup : le geste abandonné se voit.
    Animated.timing(charge, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [charge]);

  useEffect(() => cancelHold, [cancelHold]);

  const startHold = useCallback(() => {
    light(); // la butée : « il se passe quelque chose si tu tiens »
    Animated.timing(charge, {
      toValue: 1,
      duration: holdMs,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Des crans de plus en plus rapprochés — la tension monte au poignet.
    ticks.current = [0.35, 0.6, 0.78, 0.9, 0.97].map((f) =>
      setTimeout(tick, holdMs * f),
    );

    timer.current = setTimeout(() => {
      timer.current = null;
      ticks.current = [];
      armed.current = false;
      open.current = true;
      heavy(); // ça décroche
      setVisible(true);
    }, holdMs);
  }, [charge, holdMs]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (open.current) return;
      const pulled = -e.nativeEvent.contentOffset.y;
      if (pulled >= threshold) {
        // Le compte à rebours ne démarre qu'une fois, et seulement tant que le
        // tirage reste au-delà du seuil.
        if (!armed.current && !timer.current) {
          armed.current = true;
          startHold();
        }
      } else if (armed.current) {
        cancelHold();
      }
    },
    [cancelHold, startHold, threshold],
  );

  /** À brancher sur `onScrollEndDrag` : relâcher annule le tirage en cours. */
  const onRelease = cancelHold;

  /** À appeler depuis `onRefresh` — sert au repli Android. */
  const onRefreshTriggered = useCallback(() => {
    if (Platform.OS === 'ios') return;
    const now = Date.now();
    pulls.current = [...pulls.current, now].filter((t) => now - t < repeatWindowMs);
    if (pulls.current.length >= repeatCount) {
      pulls.current = [];
      open.current = true;
      heavy();
      setVisible(true);
    }
  }, [repeatCount, repeatWindowMs]);

  const dismiss = useCallback(() => {
    open.current = false;
    setVisible(false);
    charge.setValue(0);
  }, [charge]);

  return { visible, dismiss, onScroll, onRelease, onRefreshTriggered, charge };
}
