// Design tokens for Project ENM — extracted verbatim from the
// "Project ENM - App.dc.html" prototype (colours, radii, type scale).
// Parti pris: papier crème éditorial, accent bleu marine, typo serif Spectral.

export const colors = {
  // Paper / background
  paper: '#f4f1ea', // device inner background
  paperTop: '#efebe0', // radial gradient top
  paperBottom: '#e2ddd1', // radial gradient bottom

  // Navy accent
  navy: '#243f5e',
  navyDark: '#16273b',
  navySurface: 'rgba(36,63,94,0.94)', // floating tab bar

  // Cards
  cardBg: '#fffdf8',
  cardBorder: '#ece5d7',
  cardDivider: '#f0e9db',

  // Ink / text
  ink: '#22201c',
  inkSoft: '#3a352e',
  summary: '#8b857a',
  source: '#6b6459',

  // On-navy text
  onNavy: '#f2ede3',
  onNavyLabel: '#c6d2e2',
  onNavyDek: '#c3cdda',
  gold: '#e3c690',
  goldHover: '#f5e7cf',

  // Header masthead
  mastheadDate: '#a49d90',
  mastheadProject: '#9a9488',

  // Round arrow button on cards
  arrowBtnBg: '#eef0e9',

  // Floating tab bar labels/icons
  tabActive: '#ffffff',
  tabInactive: 'rgba(242,237,227,0.55)',
} as const;

export const fonts = {
  regular: 'Spectral_400Regular',
  medium: 'Spectral_500Medium',
  semibold: 'Spectral_600SemiBold',
  bold: 'Spectral_700Bold',
  italic: 'Spectral_400Regular_Italic',
  mediumItalic: 'Spectral_500Medium_Italic',
} as const;

// Fixed iPhone gabarit used throughout the prototype (402 × 874).
export const DEVICE = { width: 402, height: 874 } as const;
