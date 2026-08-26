// Edition content for Project ENM.
//
// Two editions are published every day ("matin" and "midi"); the app always
// reads whichever one is currently in the mailbox (see `slot` below).
//
// At runtime the app fetches the current edition from the GitHub content repo
// (see CONTENT_URL / src/data/remote.ts). The object below is the bundled
// FALLBACK — the sample "contenu juridique crédible" from the design prototype —
// used offline or whenever the feed is unreachable. Its shape (DailyContent) is
// exactly what the feed's content.json must return.

// "Mailbox" address — a fixed URL the app always reads. The routine drops each
// new edition here (latest.json) after archiving it under editions/, twice a
// day. If the routine skips a run, this simply keeps pointing at the last valid
// edition.
const CONTENT_REPO =
  'https://raw.githubusercontent.com/pierreespy/project-enm-content/main/';

export const CONTENT_URL = `${CONTENT_REPO}latest.json`;

/** Registre du cours d'astrophysique — sert à lister les leçons passées.
 *  Seule la leçon en cours voyage dans latest.json ; les précédentes sont
 *  chargées à la demande, une par une, depuis leur fichier d'archive. */
export const ASTRO_INDEX_URL = `${CONTENT_REPO}astro/index.json`;

/** Une entrée du registre — le minimum pour dresser le sommaire. */
export type AstroIndexEntry = { n: number; file: string; title: string };

/** URL d'archive d'une leçon. Le chemin vient du flux : on le contraint à la
 *  forme attendue plutôt que de le concaténer tel quel. */
export function astroLessonUrl(file: string): string | null {
  return /^astro\/lessons\/[A-Za-z0-9._-]+\.json$/.test(file) ? CONTENT_REPO + file : null;
}

export type Essentiel = {
  label: string;
  title: string;
  dek: string;
  source: string;
  url: string;
};

export type Rubrique = {
  chip: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  /** Per-rubrique chip colours (ink = text, tint = pill background). */
  ink: string;
  tint: string;
};

export type FicheSection = { h: string; body: string };

/** Une leçon du cours d'astrophysique — le contenu de l'onglet du même nom.
 *  Le cours est suivi : une leçon par jour, numérotée, chacune s'appuyant sur
 *  les précédentes. Le flux ne sert que la leçon en cours (champ `astro`). */
export type AstroLesson = {
  n: number;
  title: string;
  subtitle: string;
  duration?: string;
  intro: string;
  sections: FicheSection[];
  keyTerms: { term: string; def: string }[];
  recap: string;
  next?: string;
};

export type Mot = {
  label: string;
  term: string;
  subtitle: string;
  defShort: string;
  fiche: FicheSection[];
  seeAlso: string;
};

/** The full daily payload — exactly the JSON shape the content repo serves. */
export type DailyContent = {
  /** ISO date of the edition, e.g. "2026-07-09" (optional; for archive/debug). */
  date?: string;
  /** Display date shown in the masthead corner, e.g. "9 juill." */
  dateShort: string;
  /** Which of the day's two editions this is (absent on pre-2026-08 archives). */
  slot?: 'matin' | 'midi';
  /** Leçon d'astrophysique du jour (absente des archives antérieures au cours). */
  astro?: AstroLesson;
  essentiel: Essentiel;
  rubriques: Rubrique[];
  mot: Mot;
};

const dateShort = '9 juill.';

const essentiel: Essentiel = {
  label: "L'essentiel du jour",
  title: 'La Cour de cassation précise les contours de la légitime défense putative',
  dek: "Dans un arrêt du 8 juillet, la chambre criminelle rappelle que l'erreur sur l'existence d'une agression n'exonère que si elle était invincible.",
  source: 'Cass. crim., 8 juill. 2026',
  url: 'https://www.courdecassation.fr',
};

// The 6 rubriques, in order. Colours (ink/tint) match the prototype exactly.
const rubriques: Rubrique[] = [
  {
    chip: 'Législation & réglementation',
    title: 'Publication du décret encadrant la médiation préalable obligatoire',
    summary: 'Le texte étend la tentative de résolution amiable à de nouveaux litiges civils dès le 1ᵉʳ septembre.',
    source: 'JORF n°157, 9 juill. 2026',
    url: 'https://www.legifrance.gouv.fr',
    ink: '#2a4a6b',
    tint: '#eaf0f6',
  },
  {
    chip: 'Jurisprudence',
    title: 'Rupture brutale des relations commerciales : la durée du préavis réévaluée',
    summary: "La chambre commerciale érige l'ancienneté de la relation en critère prépondérant du délai raisonnable.",
    source: 'Cass. com., 2 juill. 2026',
    url: 'https://www.courdecassation.fr',
    ink: '#7a2230',
    tint: '#f6ecec',
  },
  {
    chip: 'Doctrine & études',
    title: "Le consentement à l'ère des interfaces conversationnelles",
    summary: 'Une étude interroge la validité du consentement recueilli par assistants vocaux et agents autonomes.',
    source: 'Recueil Dalloz, chronique',
    url: 'https://www.dalloz-actualite.fr',
    ink: '#2f5741',
    tint: '#eaf2ed',
  },
  {
    chip: 'Culture générale',
    title: 'Aux origines du serment : de Rome au prétoire contemporain',
    summary: 'Retour sur la fonction rituelle du serment judiciaire et son héritage dans la procédure moderne.',
    source: "Revue d'histoire du droit",
    url: 'https://www.persee.fr',
    ink: '#7d5a1c',
    tint: '#f6f0e2',
  },
  {
    chip: 'Pratique & procédure',
    title: "Notification par voie électronique : les nouvelles diligences de l'avocat",
    summary: "Le RPVA impose désormais un accusé de lecture horodaté pour les actes du contentieux commercial.",
    source: 'Conseil national des barreaux',
    url: 'https://www.cnb.avocat.fr',
    ink: '#2f5566',
    tint: '#eaf2f4',
  },
  {
    chip: 'Actualité classique',
    title: 'Canicule : un pic de chaleur attendu sur le sud du pays',
    summary: 'Météo-France place douze départements en vigilance orange pour la fin de semaine.',
    source: 'Météo-France',
    url: 'https://meteofrance.com',
    ink: '#5a3f66',
    tint: '#f1ecf4',
  },
];

const mot: Mot = {
  label: 'Le mot du jour',
  term: 'Présomption de légitime défense',
  subtitle: 'Droit pénal · Article 122-6 du Code pénal',
  defShort:
    "Situation dans laquelle la loi répute accomplis les actes de défense, dispensant celui qui riposte d'avoir à prouver la nécessité de son geste.",
  fiche: [
    {
      h: 'En bref',
      body: "Dérogation au régime probatoire de la légitime défense : dans des hypothèses limitativement énumérées, l'auteur de l'acte est présumé avoir agi en état de légitime défense.",
    },
    {
      h: 'Fondement',
      body: "Article 122-6 du Code pénal, complétant le régime de droit commun posé à l'article 122-5.",
    },
    {
      h: 'Cas visés',
      body: "Riposte pour repousser, de nuit, l'entrée par effraction, violence ou ruse dans un lieu habité ; défense contre les auteurs de vols ou pillages exécutés avec violence.",
    },
    {
      h: 'Portée',
      body: "La présomption est simple : elle peut être renversée par la preuve que les conditions de la légitime défense n'étaient pas réunies.",
    },
  ],
  seeAlso: 'Voir aussi — légitime défense (art. 122-5) · état de nécessité (art. 122-7)',
};


/** Leçon embarquée — la première du cours, servie tant que le flux est muet. */
const astro: AstroLesson = {
  n: 1,
  title: "Regarder loin, c'est regarder dans le passé",
  subtitle: "Ce qu'étudie l'astrophysique, et pourquoi la lumière est sa seule pièce au dossier",
  duration: '6 min',
  intro:
    "Première leçon : on ne suppose rien. Pas de formule, pas de vocabulaire acquis. On pose seulement les deux ou trois idées sans lesquelles rien de la suite ne tiendrait.",
  sections: [
    {
      h: 'Décrire, puis expliquer',
      body: "L'astronomie observe et décrit : où sont les astres, comment ils se déplacent. L'astrophysique applique à ces objets les lois de la physique ordinaire — chaleur, gravité, lumière — pour expliquer pourquoi ils sont ainsi. Le pari, immense, est que les lois valables dans un laboratoire terrestre valent aussi à dix milliards de milliards de kilomètres.",
    },
    {
      h: 'La seule pièce au dossier : la lumière',
      body: "Presque tout ce que nous savons de l'univers nous est arrivé sous forme de lumière — visible, mais aussi ondes radio, infrarouge, rayons X, de même nature à l'énergie près. Ce témoin unique a une propriété décisive : il voyage vite, environ 300 000 kilomètres par seconde, mais pas instantanément.",
    },
    {
      h: "L'échelle, en temps de trajet",
      body: "On mesure donc les distances par le temps que la lumière met à les parcourir. La Lune est à 1,3 seconde-lumière, le Soleil à 8 minutes, l'étoile la plus proche à 4,2 années-lumière, la galaxie d'Andromède à 2,5 millions d'années-lumière. Une année-lumière est une distance, jamais une durée.",
    },
    {
      h: 'La conséquence : le ciel est un passé',
      body: "Nous ne voyons jamais un astre tel qu'il est, mais tel qu'il était quand sa lumière est partie. Regarder loin, c'est mécaniquement regarder tôt : l'outil le plus puissant de la discipline, et sa limite la plus dure.",
    },
  ],
  keyTerms: [
    {
      term: 'Astrophysique',
      def: "Application des lois de la physique aux objets célestes, pour expliquer leur nature et leur évolution — là où l'astronomie se borne à les décrire.",
    },
    {
      term: 'Année-lumière',
      def: "Une distance, non une durée : celle que la lumière parcourt en un an, environ 9 500 milliards de kilomètres.",
    },
    {
      term: 'Vitesse de la lumière',
      def: "Environ 300 000 km/s dans le vide. Finie, et indépassable — d'où le décalage entre ce qu'un astre est et ce que nous en voyons.",
    },
  ],
  recap:
    "L'astrophysique explique les astres avec la physique d'ici-bas, sans pouvoir expérimenter sur eux. Elle ne travaille que sur la lumière reçue. Celle-ci voyageant à vitesse finie, toute observation lointaine est celle d'un état passé.",
  next: 'Prochaine leçon — pourquoi une étoile brille, et pourquoi cela ne dure pas.',
};

/** Bundled offline fallback — served whenever the GitHub feed is unreachable. */
export const fallbackContent: DailyContent = { dateShort, essentiel, rubriques, mot, astro };
