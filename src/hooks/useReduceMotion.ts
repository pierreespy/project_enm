import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Le réglage système « Réduire les animations ».
 *
 * `null` tant qu'on ne sait pas : une animation ne doit ni démarrer ni être
 * escamotée avant la réponse, sinon le contenu clignote au premier rendu.
 *
 * Ce que l'app en fait : les mouvements décoratifs (entrées en fondu, ressorts,
 * tressautements, boucles) sont supprimés ; les retours haptiques, eux, sont
 * conservés — ils ne relèvent pas du même réglage, et ce sont eux qui portent
 * l'information quand le mouvement disparaît.
 */
export function useReduceMotion(): boolean | null {
  const [reduce, setReduce] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => alive && setReduce(v))
      .catch(() => alive && setReduce(false));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduce;
}
