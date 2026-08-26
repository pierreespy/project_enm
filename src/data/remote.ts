import {
  ASTRO_INDEX_URL,
  CONTENT_URL,
  astroLessonUrl,
  fallbackContent,
  type AstroIndexEntry,
  type AstroLesson,
  type DailyContent,
} from './content';

/**
 * Fetch today's content from the GitHub content repo. Returns the parsed
 * DailyContent, or `null` on any network / parse / shape error so the caller
 * can fall back to the bundled content. A cache-busting query param avoids the
 * raw.githubusercontent CDN serving a stale copy after the daily overwrite.
 */
export async function fetchDailyContent(): Promise<DailyContent | null> {
  try {
    const res = await fetch(`${CONTENT_URL}?t=${Date.now()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<DailyContent>;
    return isValidContent(data) ? data : null;
  } catch {
    return null;
  }
}

/** Minimal structural guard — enough to avoid rendering a malformed feed. */
function isValidContent(d: Partial<DailyContent> | null): d is DailyContent {
  return (
    !!d &&
    typeof d.dateShort === 'string' &&
    !!d.essentiel &&
    typeof d.essentiel.title === 'string' &&
    Array.isArray(d.rubriques) &&
    d.rubriques.length > 0 &&
    !!d.mot &&
    typeof d.mot.term === 'string' &&
    Array.isArray(d.mot.fiche)
  );
}

/**
 * Sommaire du cours d'astrophysique, de la leçon la plus récente à la première.
 * `null` sur toute erreur — l'appli se contente alors de la leçon du jour.
 */
export async function fetchAstroIndex(): Promise<AstroIndexEntry[] | null> {
  try {
    const res = await fetch(`${ASTRO_INDEX_URL}?t=${Date.now()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { lessons?: unknown };
    if (!Array.isArray(data?.lessons)) return null;
    const lessons = data.lessons.filter(
      (l): l is AstroIndexEntry =>
        !!l &&
        typeof (l as AstroIndexEntry).n === 'number' &&
        typeof (l as AstroIndexEntry).title === 'string' &&
        !!astroLessonUrl((l as AstroIndexEntry).file),
    );
    return lessons.sort((a, b) => b.n - a.n);
  } catch {
    return null;
  }
}

/** Charge une leçon d'archive. `null` si l'URL est invalide ou la leçon illisible. */
export async function fetchAstroLesson(file: string): Promise<AstroLesson | null> {
  const url = astroLessonUrl(file);
  if (!url) return null;
  try {
    const res = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<AstroLesson>;
    return isValidLesson(data) ? data : null;
  } catch {
    return null;
  }
}

function isValidLesson(l: Partial<AstroLesson> | null): l is AstroLesson {
  return (
    !!l &&
    typeof l.n === 'number' &&
    typeof l.title === 'string' &&
    Array.isArray(l.sections) &&
    l.sections.length > 0 &&
    Array.isArray(l.keyTerms) &&
    typeof l.recap === 'string'
  );
}

export { fallbackContent };
export type { DailyContent, AstroLesson, AstroIndexEntry };
