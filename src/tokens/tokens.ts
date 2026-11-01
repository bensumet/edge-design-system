// Edge design tokens.
//
// The palette comes from a leather workshop: dark, quiet surfaces (navy and
// black hide) and one bold edge-paint color per piece. The light mode takes
// ivory stock, deep ink and gold leaf, like a luxury goods catalog.
//
// Every color pair the UI relies on is checked against WCAG AA in
// src/tokens/tokens.test.ts, so a token change that breaks contrast fails CI.

export type Mode = 'ink' | 'paper';
export type EdgeName = 'orange' | 'mint' | 'red' | 'purple' | 'blue';

export interface Surfaces {
  background: string; // page
  surface: string; // cards, app bar
  raised: string; // menus, dialogs, hover fills
  border: string; // dividers, outlines (decorative)
  control: string; // input outlines: 3:1 against surface (WCAG 1.4.11)
  text: string; // primary text
  muted: string; // secondary text
}

export interface EdgeColor {
  label: string;
  /** Name of the paper-mode color, from the wall-art palette. */
  paperLabel: string;
  /** Accent used for text, focus rings, outlines and fills in this mode. */
  ink: string;
  paper: string;
  /** Text placed on top of a filled accent (buttons, chips). */
  onInk: string;
  onPaper: string;
}

export const surfaces: Record<Mode, Surfaces> = {
  ink: {
    background: '#0E1420',
    surface: '#161D2B',
    raised: '#1F2838',
    border: '#2E384B',
    control: '#6B778C',
    text: '#ECEFF4',
    muted: '#A9B3C4',
  },
  // Paper is set like a luxury goods catalog: warm ivory stock, deep ink,
  // and gold leaf, with jewel tones for the accents.
  paper: {
    background: '#FAF7F1',
    surface: '#FFFFFF',
    raised: '#F3EEE4',
    border: '#E3D9C6',
    control: '#8A8174',
    text: '#1A1714',
    muted: '#5A5247',
  },
};

// Edge paints. On ink the paint is bright; on paper it is deepened so the
// same hue still reads as text and as a button fill.
export const edges: Record<EdgeName, EdgeColor> = {
  orange: { label: 'Orange', paperLabel: 'Gold', ink: '#FF8F45', paper: '#7A5A1C', onInk: '#0E1420', onPaper: '#FFFFFF' },
  mint: { label: 'Mint', paperLabel: 'Emerald', ink: '#4FD8BA', paper: '#1F5C4A', onInk: '#0E1420', onPaper: '#FFFFFF' },
  red: { label: 'Red', paperLabel: 'Garnet', ink: '#FF6B63', paper: '#7E2233', onInk: '#0E1420', onPaper: '#FFFFFF' },
  purple: { label: 'Purple', paperLabel: 'Amethyst', ink: '#BC9BFF', paper: '#5A3A6E', onInk: '#0E1420', onPaper: '#FFFFFF' },
  blue: { label: 'Electric blue', paperLabel: 'Sapphire', ink: '#7FA6FF', paper: '#24406E', onInk: '#0E1420', onPaper: '#FFFFFF' },
};

/**
 * Chapter palettes. The layout comes from the chapter openers of a 600-page
 * guide I designed: a tinted opener with a stack of related colors striped
 * down the fore-edge. In ink mode the stripes are bright edge paints; in
 * paper mode they are gold leaf, graded from champagne to antique gold, with
 * a line of black, on ivory stock. Stripes are decorative and never carry
 * text.
 */
export interface Chapter {
  /** Opener tint in paper mode. */
  tint: string;
  /** Page background in paper mode. */
  wash: string;
  /** Five stripes for ink mode, light to dark. */
  stripes: readonly [string, string, string, string, string];
  /** Five stripes for paper mode, light to dark. */
  paperStripes: readonly [string, string, string, string, string];
}

// Ivory and gold: every paper chapter opens on champagne stock, with gold
// leaf graded from pale to antique and a line of black striped down the edge.
const mat = '#FAF7F1';
const matTint = '#EFE6D4';
const wallet = ['#E9DCC0', '#D4BB82', '#B8954F', '#8C6A2F', '#1A1714'] as const;

export const chapters: Record<EdgeName, Chapter> = {
  orange: {
    tint: matTint, wash: mat,
    stripes: ['#F0960C', '#F8700D', '#F26520', '#B2361C', '#6E1F0E'],
    paperStripes: wallet,
  },
  mint: {
    tint: matTint, wash: mat,
    stripes: ['#5FCDB7', '#00A99D', '#008C8C', '#00505A', '#0E2E33'],
    paperStripes: wallet,
  },
  red: {
    tint: matTint, wash: mat,
    stripes: ['#DA3E6E', '#ED1874', '#E23469', '#AF2851', '#71103D'],
    paperStripes: wallet,
  },
  purple: {
    tint: matTint, wash: mat,
    stripes: ['#DC30A0', '#B52B8B', '#A52F83', '#942898', '#5A1041'],
    paperStripes: wallet,
  },
  blue: {
    tint: matTint, wash: mat,
    stripes: ['#00ADEF', '#9FCEDE', '#1C6EC4', '#134F8E', '#00273E'],
    paperStripes: wallet,
  },
};

/** Page surfaces for a mode and chapter: paper takes the chapter's wash. */
export function surfacesFor(mode: Mode, edge: EdgeName): Surfaces {
  if (mode === 'paper') return { ...surfaces.paper, background: chapters[edge].wash };
  return surfaces[mode];
}

export const status = {
  ink: { success: '#5FD38D', warning: '#F2C14E', error: '#FF7A72', info: '#7FB2FF' },
  paper: { success: '#0F6B37', warning: '#7A4F00', error: '#B00E28', info: '#124A86' },
} as const;

// Three voices, as in my type study and book work: a grotesque set Swiss
// style (bold over light, huge against tiny), a Garamond for reading text and
// chapter marks, and Inter for interface labels and numbers.
export const typography = {
  display: '"EB Garamond", Garamond, "Times New Roman", serif',
  // A variable grotesque (width 62–125%, weight 100–900) for poster-scale
  // headlines, set against the Garamond like a bold cover against its text.
  poster: '"Archivo Variable", Archivo, "Arial Narrow", Inter, sans-serif',
  body: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  // A 1.25 (major third) scale from a 16px base, in px.
  scale: { xs: 12.8, sm: 14, base: 16, lg: 20, xl: 25, '2xl': 31.25, '3xl': 39, '4xl': 48.8 },
  measure: '66ch', // comfortable line length for reading
  readingLeading: 1.65,
} as const;

export const space = [0, 4, 8, 12, 16, 24, 32, 48, 64] as const;
// Square corners throughout, like cut leather and trimmed paper.
export const radius = { sm: 0, md: 0, lg: 0 } as const;

export function accent(edge: EdgeName, mode: Mode) {
  const e = edges[edge];
  if (mode === 'ink') return { main: e.ink, on: e.onInk };
  return { main: e.paper, on: e.onPaper };
}

/** The color's name in the current mode. */
export function edgeLabel(edge: EdgeName, mode: Mode): string {
  return mode === 'paper' ? edges[edge].paperLabel : edges[edge].label;
}

/** The edge color as used for text and fills in a mode. */
export function edgeColor(edge: EdgeName, mode: Mode): string {
  return accent(edge, mode).main;
}
