import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Retours haptiques — le vocabulaire tactile de l'app.
 *
 * Chaque geste doit tomber dans l'une de ces cases : c'est ce qui garde
 * l'ensemble cohérent plutôt que bruyant. L'échelle va du plus discret
 * (`tick`, une sélection) au plus franc (`heavy`, un événement subi).
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

/** Le plus fin de l'échelle : un cran franchi pendant un geste continu. */
export const tick = () =>
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid));

/** Un effleurement mat — repli, fermeture, annulation. */
export const soft = () =>
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));

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

/** Ça n'a pas marché : leçon d'archive introuvable, relève en échec. */
export const failure = () =>
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));

type Step = [delayMs: number, hit: () => void];

/**
 * Joue une figure haptique — une suite de coups décalés dans le temps.
 *
 * Les délais sont **relatifs au précédent**, ce qui rend la figure lisible à
 * l'écriture : `[[0, heavy], [90, heavy]]` est un double coup rapproché.
 * Retourne une fonction qui annule les coups pas encore joués — indispensable
 * dès qu'une figure peut être interrompue (un appel qu'on décroche).
 */
export function figure(steps: Step[]): () => void {
  if (!supported) return () => {};
  const timers: ReturnType<typeof setTimeout>[] = [];
  let at = 0;
  for (const [delay, hit] of steps) {
    at += delay;
    timers.push(setTimeout(hit, at));
  }
  return () => timers.forEach(clearTimeout);
}

/** La cadence d'un téléphone qui sonne : deux coups collés. */
export const ringPulse = () => figure([[0, heavy], [120, heavy], [90, medium]]);
