import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

/**
 * Easter egg — "tirer longtemps depuis le haut".
 *
 * Un tirage normal déclenche le rafraîchissement habituel. Si l'utilisateur
 * continue à tirer au-delà de `threshold` px et **maintient** ce tirage pendant
 * `holdMs`, on ouvre l'appel entrant (voir components/IncomingCall).
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
  const pulls = useRef<number[]>([]);

  const cancelHold = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => cancelHold, [cancelHold]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const pulled = -e.nativeEvent.contentOffset.y;
      if (pulled >= threshold) {
        // Le compte à rebours ne démarre qu'une fois, et seulement tant que le
        // tirage reste au-delà du seuil.
        if (!timer.current) {
          timer.current = setTimeout(() => {
            timer.current = null;
            setVisible(true);
          }, holdMs);
        }
      } else {
        cancelHold();
      }
    },
    [cancelHold, holdMs, threshold],
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
      setVisible(true);
    }
  }, [repeatCount, repeatWindowMs]);

  const dismiss = useCallback(() => setVisible(false), []);

  return { visible, dismiss, onScroll, onRelease, onRefreshTriggered };
}
