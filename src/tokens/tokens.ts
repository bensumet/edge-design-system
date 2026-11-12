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
  // Code, token names and file paths. System faces only; nothing to download.
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  // A 1.25 (major third) scale from a 16px base, in px.
  scale: { xs: 12.8, sm: 14, base: 16, lg: 20, xl: 25, '2xl': 31.25, '3xl': 39, '4xl': 48.8 },
  measure: '66ch', // comfortable line length for reading
  readingLeading: 1.65,
} as const;

/**
 * Text roles: every piece of text on a screen is one of these. The theme turns
 * each role into a Typography variant (`<Typography variant="prose">`), so a
 * screen picks a role and never sets font, size or leading itself.
 * Sizes are rem; leading is unitless. `size` may vary by breakpoint.
 */
export type TextRole =
  | 'poster' | 'posterItalic' | 'posterSection' | 'posterSectionItalic' | 'indexTitle' | 'figure'
  | 'hero' | 'heroItalic' | 'signoff' | 'accentItalic' | 'posterMinor' | 'byline' | 'smallCaps'
  | 'lead' | 'prose' | 'eyebrow' | 'kicker' | 'nav' | 'tab' | 'metric' | 'amount' | 'label' | 'data' | 'mono' | 'caption' | 'brand';

export interface TextRoleSpec {
  family: keyof Pick<typeof typography, 'display' | 'poster' | 'body' | 'mono'>;
  /** 'inherit' takes the size of the line the text sits in. */
  size: string | { xs: string; md: string };
  leading: number | 'inherit';
  weight?: number;
  /** Width axis of the variable grotesque, in percent. */
  stretch?: number;
  tracking?: string;
  italic?: boolean;
  /** true sets capitals; false undoes capitals inherited from a caps line. */
  caps?: boolean;
  /** True small caps from the font's own glyphs, not shrunken capitals. */
  smallCaps?: boolean;
  /** Tabular, lining figures, for numbers compared in columns. */
  tabular?: boolean;
  /** Default text color: the main text, the muted text or the accent. */
  tone?: 'text' | 'muted' | 'accent';
  description: string;
}

export const textRoles: Record<TextRole, TextRoleSpec> = {
  hero: { family: 'poster', size: 'clamp(3.2rem, 1rem + 9vw, 8.6rem)', leading: 0.84, weight: 850, stretch: 70, caps: true, description: 'The home page statement; once per site.' },
  heroItalic: { family: 'display', size: 'clamp(2.1rem, 1rem + 4.6vw, 5rem)', leading: 1.02, weight: 400, italic: true, tone: 'accent', description: 'The italic line under the hero.' },
  signoff: { family: 'poster', size: 'clamp(2.6rem, 1rem + 5vw, 5.5rem)', leading: 0.82, weight: 850, stretch: 72, caps: true, description: 'The closing line in the footer.' },
  accentItalic: { family: 'display', size: 'inherit', leading: 'inherit', weight: 400, italic: true, caps: false, tone: 'accent', description: 'A Garamond italic run inside a poster line, at that line\'s size.' },
  poster: { family: 'poster', size: 'clamp(2.8rem, 1.2rem + 6vw, 6.4rem)', leading: 0.88, weight: 850, stretch: 72, caps: true, description: 'The bold first line of a page title.' },
  posterItalic: { family: 'display', size: 'clamp(2rem, 1rem + 4vw, 4.4rem)', leading: 1.05, weight: 400, italic: true, tone: 'accent', description: 'The Garamond italic second line of a page title.' },
  posterSection: { family: 'poster', size: 'clamp(2rem, 1.2rem + 3vw, 3.4rem)', leading: 0.88, weight: 850, stretch: 72, caps: true, description: 'A title one step down from the page title.' },
  posterSectionItalic: { family: 'display', size: 'clamp(1.5rem, 1rem + 2vw, 2.4rem)', leading: 1.05, weight: 400, italic: true, tone: 'accent', description: 'Italic counterpart of posterSection.' },
  posterMinor: { family: 'poster', size: { xs: '1.7rem', md: '2.3rem' }, leading: 0.92, weight: 850, stretch: 72, caps: true, description: 'A small poster title: a book or chapter opener inside a section.' },
  byline: { family: 'display', size: '1.3rem', leading: 1.3, italic: true, tone: 'accent', description: 'An italic name under or beside a title: an author, a publisher, the wordmark\'s surname.' },
  smallCaps: { family: 'display', size: 'inherit', leading: 'inherit', weight: 500, tracking: '0.06em', smallCaps: true, description: 'A run of true small caps in Garamond: the opening words of a lead, abbreviations.' },
  indexTitle: { family: 'poster', size: { xs: '1.5rem', md: '1.9rem' }, leading: 1, weight: 750, stretch: 80, caps: true, description: 'Titles in a contents list.' },
  figure: { family: 'poster', size: { xs: '2.2rem', md: '3rem' }, leading: 0.9, weight: 850, stretch: 72, tabular: true, tone: 'accent', description: 'A headline number in a row of results.' },
  lead: { family: 'display', size: { xs: '1.2rem', md: '1.32rem' }, leading: 1.65, tone: 'text', description: 'Opening and featured paragraphs.' },
  prose: { family: 'display', size: '1.15rem', leading: 1.55, description: 'Reading text: explanations under a label, essays, captions with substance.' },
  eyebrow: { family: 'body', size: '0.7rem', leading: 1.4, weight: 600, tracking: '0.24em', caps: true, tone: 'muted', description: 'A small letterspaced label above a title or a value.' },
  nav: { family: 'body', size: '0.72rem', leading: 1.4, weight: 600, tracking: '0.18em', caps: true, description: 'Section links in the site navigation.' },
  amount: { family: 'display', size: { xs: '2.4rem', md: '3rem' }, leading: 1.05, tabular: true, description: 'The one figure a screen is about, like a quote\'s total, in Garamond.' },
  metric: { family: 'body', size: '1.3rem', leading: 1.3, weight: 700, tabular: true, description: 'A key figure in a product screen\'s summary strip.' },
  tab: { family: 'body', size: '1rem', leading: 1.5, weight: 600, description: 'Page links inside a section, set as tabs.' },
  kicker: { family: 'body', size: '0.62rem', leading: 1.4, weight: 600, tracking: '0.42em', caps: true, description: 'Widely spaced diagram labels and running heads.' },
  label: { family: 'body', size: '1rem', leading: 1.35, weight: 650, description: 'The bold head of a point, a row or a card.' },
  data: { family: 'body', size: '1rem', leading: 1.5, weight: 600, tabular: true, tone: 'accent', description: 'Numbers that line up: step numbers, counts.' },
  mono: { family: 'mono', size: '0.85rem', leading: 1.6, description: 'Code, file names and token names.' },
  caption: { family: 'body', size: '0.85rem', leading: 1.5, tone: 'muted', description: 'Notes under figures and small print.' },
  brand: { family: 'poster', size: '1.35rem', leading: 1, weight: 850, stretch: 72, caps: true, tracking: '-0.01em', description: 'The wordmark: bold first name.' },
};

/**
 * Layout presets: the column structures screens repeat. Each value is a
 * responsive grid-template-columns; the Columns component takes the name.
 */
export const layout = {
  columns: {
    halves: { xs: '1fr', md: '1fr 1fr' },
    halvesEarly: { xs: '1fr', sm: '1fr 1fr' },
    thirds: { xs: '1fr', md: 'repeat(3, 1fr)' },
    quarters: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
    /** A label column beside its content. */
    aside: { xs: '1fr', md: '12rem 1fr' },
    asideWide: { xs: '1fr', md: '14rem 1fr' },
    /** Number, head and body: numbered decisions and gates. */
    numbered: { xs: '2.5rem 1fr', md: '3rem 1fr 1.3fr' },
    /** A contents page: number, title, note. */
    contents: { xs: '3rem 1fr', md: '4rem 1fr 1.2fr' },
    /** A main column beside a supporting one, 7:5. */
    wideNarrow: { xs: '1fr', md: '7fr 5fr' },
    /** A narrow note beside a wide figure. */
    narrowWide: { xs: '1fr', md: '1fr 2fr' },
  },
  /** Vertical space between page sections, in theme spacing units. */
  sectionGap: { xs: 6, md: 8 },
} as const;
export type ColumnPreset = keyof typeof layout.columns;

export const space = [0, 4, 8, 12, 16, 24, 32, 48, 64] as const;
// Square corners throughout, like cut leather and trimmed paper.
export const radius = { sm: 0, md: 0, lg: 0 } as const;

// Motion answers what a person did: open, switch, arrive. Durations in ms.
// Everything collapses to an instant change under prefers-reduced-motion.
export const motion = {
  duration: { quick: 140, base: 240, enter: 420 },
  // Settles like paper laid down: fast start, soft landing.
  ease: { enter: 'cubic-bezier(0.2, 0.7, 0.2, 1)', standard: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  // Distance an arriving block travels, in px. Small: it moves into place, it doesn't fly in.
  rise: 8,
  reduced: '@media (prefers-reduced-motion: reduce)',
} as const;

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
