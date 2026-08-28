import { useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const RINGTONE = require('../../assets/ringtone.mp3');

/**
 * La sonnerie de l'appel entrant.
 *
 * Le morceau est joué **en entier, une seule fois** : il commence quand l'écran
 * d'appel apparaît et s'arrête net dès qu'on décroche ou qu'on refuse. Il n'est
 * donc pas bouclé, et sa durée n'a pas besoin d'être connue du code — la
 * cadence des vibrations, elle, est pilotée à part par l'écran d'appel.
 *
 * Remplacer la sonnerie = remplacer `assets/ringtone.mp3`, rien d'autre.
 *
 * Le lecteur est créé à la demande, à la première sonnerie, puis conservé :
 * l'app n'ouvre pas de session audio tant que l'easter egg dort.
 */
let player: AudioPlayer | null = null;

function ensurePlayer(): AudioPlayer | null {
  if (player) return player;
  try {
    player = createAudioPlayer(RINGTONE);
    return player;
  } catch {
    // Pas de moteur audio (web restreint, appareil exotique) : l'appel se joue
    // alors en haptique seul, ce qui reste parfaitement lisible.
    return null;
  }
}

/** Fait sonner tant que `active` est vrai. Coupe au démontage. */
export function useRingtone(active: boolean) {
  // Garde-fou : `active` peut basculer plusieurs fois vite (décrocher puis
  // fermer), on ne veut pas relancer la lecture après un arrêt.
  const live = useRef(false);

  useEffect(() => {
    live.current = active;
    if (!active) {
      player?.pause();
      return;
    }

    // Une sonnerie qui ne sonne pas n'en est pas une : on demande à sortir du
    // mode silencieux pour ce moment-là — l'utilisateur vient de le déclencher
    // volontairement, et l'écran d'appel est déjà à l'écran.
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' })
      .catch(() => {})
      .finally(() => {
        if (!live.current) return;
        const p = ensurePlayer();
        if (!p) return;
        try {
          // Rembobinage obligatoire : sans boucle, le lecteur reste sur la
          // dernière image après un appel — le suivant serait muet.
          p.seekTo(0).catch(() => {});
          p.play();
        } catch {
          /* meilleur effort */
        }
      });

    return () => {
      live.current = false;
      try {
        player?.pause();
      } catch {
        /* meilleur effort */
      }
    };
  }, [active]);
}
