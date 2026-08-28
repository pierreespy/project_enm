import { useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const RINGTONE = require('../../assets/ringtone.mp3');

/**
 * Durée d'une boucle de sonnerie, en millisecondes — c'est la cadence sur
 * laquelle l'écran d'appel cale ses vibrations et son tressautement.
 *
 * La valeur est celle du fichier **encodé** (3 605 ms), pas celle annoncée par
 * le générateur (3 570 ms) : le MP3 ajoute quelques dizaines de millisecondes
 * de silence à l'encodage. Si la sonnerie est regénérée, relever la durée avec
 * `ffprobe assets/ringtone.mp3` et reporter le chiffre ici.
 */
export const RING_LOOP_MS = 3605;

/**
 * La sonnerie de l'appel entrant.
 *
 * Le fichier est une composition maison (voir tools/make-ringtone.py) : un
 * arpège de marimba dans l'esprit d'une sonnerie de téléphone. Il contient déjà
 * sa propre cadence — deux salves puis un silence — et tourne en boucle, ce qui
 * évite de piloter le rythme depuis le JS.
 *
 * Le lecteur est créé à la demande, à la première sonnerie, puis conservé :
 * l'app n'ouvre pas de session audio tant que l'easter egg dort.
 */
let player: AudioPlayer | null = null;

function ensurePlayer(): AudioPlayer | null {
  if (player) return player;
  try {
    player = createAudioPlayer(RINGTONE);
    player.loop = true;
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
