import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Retours haptiques — enveloppe volontairement minimale.
 *
 * Le vocabulaire est court et sémantique : chaque geste de l'app doit tomber
 * dans l'une de ces cinq cases, faute de quoi l'ensemble devient bruyant. Sur
 * une app de lecture, l'haptique souligne l'action, il ne l'accompagne pas.
 *
 * Tout est en « meilleur effort » : un appareil sans moteur haptique, ou le web,
 * ne doit jamais faire échouer l'interaction qui l'a déclenché.
 */
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

const run = (fn: () => Promise<void>) => {
  if (supported) fn().catch(() => {});
};

/** Changement de sélection : onglet, ligne de sommaire. */
export const tap = () => run(() => Haptics.selectionAsync());

/** Action légère confirmée : ouverture d'un lien, dépliage d'une fiche. */
export const light = () =>
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

/** Action franche : refus d'un appel, rafraîchissement déclenché. */
export const medium = () =>
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

/** Événement inattendu : l'easter egg qui s'ouvre, la sonnerie. */
export const heavy = () =>
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));

/** Aboutissement : appel décroché, contenu du jour relevé. */
export const success = () =>
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
