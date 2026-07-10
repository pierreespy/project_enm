// Daily content for Project ENM.
//
// At runtime the app fetches the day's content from the GitHub content repo
// (see CONTENT_URL / src/data/remote.ts). The object below is the bundled
// FALLBACK — the sample "contenu juridique crédible" from the design prototype —
// used offline or whenever the feed is unreachable. Its shape (DailyContent) is
// exactly what the feed's content.json must return.

// Raw JSON feed — one file per day, overwritten daily in the content repo.
export const CONTENT_URL =
  'https://raw.githubusercontent.com/pierreespy/project-enm-content/main/content.json';

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
  dateShort: string;
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

/** Bundled offline fallback — served whenever the GitHub feed is unreachable. */
export const fallbackContent: DailyContent = { dateShort, essentiel, rubriques, mot };
