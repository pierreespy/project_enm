import { CONTENT_URL, fallbackContent, type DailyContent } from './content';

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

export { fallbackContent };
export type { DailyContent };
