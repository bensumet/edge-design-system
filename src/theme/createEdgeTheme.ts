// Types theme.vars (the CSS variables) on every theme.
import type {} from '@mui/material/themeCssVarsAugmentation';
import { createTheme, darken, getLuminance, lighten, type CSSObject, type PaletteOptions, type Theme } from '@mui/material/styles';
import {
  accent, chapters, motion, radius, status, surfacesFor, textRoles, typography,
  type EdgeName, type Mode, type TextRole,
} from '../tokens/tokens';

/** The five chapter stripes, light to dark. Decorative only. */
export interface Stripes { s1: string; s2: string; s3: string; s4: string; s5: string }

export interface EdgePalette {
  border: string;
  raised: string;
  control: string;
  /** Opener tint: the chapter color in paper mode, the surface in ink mode. */
  tint: string;
  stripes: Stripes;
  /** Fine connecting rules in page openers. */
  line: string;
  /** Opacity of the pale decorative words: stronger on paper, quieter on ink. */
  /** Opacity of large pale type: the hero's vertical word and GhostWord. Strings, so the CSS variable stays unitless. */
  ghost: { hero: string; word: string };
}

type RoleVariants = { [K in TextRole]: React.CSSProperties };
type RoleVariantOptions = { [K in TextRole]?: React.CSSProperties };
type RoleVariantFlags = { [K in TextRole]: true };

declare module '@mui/material/styles' {
  interface Palette { edge: EdgePalette }
  interface PaletteOptions { edge?: EdgePalette }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariants extends RoleVariants {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariantsOptions extends RoleVariantOptions {}
}
declare module '@mui/material/Typography' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyPropsVariantOverrides extends RoleVariantFlags {}
}

/** CSS variables are named --edge-*; the mode attribute on <html> switches them. */
export const CSS_VAR_PREFIX = 'edge';
export const MODE_ATTRIBUTE = 'data-edge-mode';
/** MUI's two color schemes carry Edge's two modes. */
export const schemeFor: Record<Mode, 'light' | 'dark'> = { ink: 'dark', paper: 'light' };
export const modeFor = { dark: 'ink', light: 'paper' } as const satisfies Record<'light' | 'dark', Mode>;

const cssVar = (path: string) => `var(--${CSS_VAR_PREFIX}-${path})`;
const tones = { text: cssVar('palette-text-primary'), muted: cssVar('palette-text-secondary'), accent: cssVar('palette-primary-main') };
const MD = '@media (min-width:900px)';

/** One text role as a Typography variant. */
function roleStyle(role: TextRole): CSSObject {
  const r = textRoles[role];
  const style: CSSObject = {
    fontFamily: typography[r.family],
    lineHeight: r.leading,
    ...(r.weight && { fontWeight: r.weight }),
    ...(r.stretch && { fontStretch: `${r.stretch}%` }),
    ...(r.tracking && { letterSpacing: r.tracking }),
    ...(r.italic && { fontStyle: 'italic' }),
    ...(r.caps !== undefined && { textTransform: r.caps ? 'uppercase' : 'none' }),
    ...(r.smallCaps && { fontVariantCaps: 'all-small-caps' }),
    ...(r.tabular && { fontVariantNumeric: 'tabular-nums lining-nums' }),
    ...(r.tone && { color: tones[r.tone] }),
  };
  if (typeof r.size === 'string') style.fontSize = r.size;
  else { style.fontSize = r.size.xs; style[MD] = { fontSize: r.size.md }; }
  // Reading text keeps to a comfortable line length wherever it sits.
  if (role === 'lead' || role === 'prose' || role === 'caption') style.maxWidth = typography.measure;
  return style;
}

const roles = Object.keys(textRoles) as TextRole[];
const variantMapping: Partial<Record<string, string>> = {
  hero: 'span', heroItalic: 'span', signoff: 'p', accentItalic: 'span', nav: 'span',
  poster: 'span', posterItalic: 'span', posterSection: 'span', posterSectionItalic: 'span', indexTitle: 'span',
  figure: 'p', lead: 'p', prose: 'p', eyebrow: 'p', kicker: 'span', tab: 'span', metric: 'p', amount: 'p', label: 'p', data: 'span', mono: 'code', caption: 'p', brand: 'span', byline: 'p', posterMinor: 'span', smallCaps: 'span',
};

/** Palette for one mode, from tokens. */
function paletteFor(mode: Mode, edge: EdgeName): PaletteOptions {
  const s = surfacesFor(mode, edge);
  const ch = chapters[edge];
  const a = accent(edge, mode);
  const st = status[mode];
  const [s1, s2, s3, s4, s5] = mode === 'paper' ? ch.paperStripes : ch.stripes;
  return {
    // Hover moves away from the text color, so a pressed or hovered button never loses contrast:
    // dark text on a bright accent lightens; light text on a deep accent darkens.
    primary: { main: a.main, contrastText: a.on, dark: getLuminance(a.on) < 0.5 ? lighten(a.main, 0.16) : darken(a.main, 0.16) },
    background: { default: s.background, paper: s.surface },
    text: { primary: s.text, secondary: s.muted },
    divider: s.border,
    success: { main: st.success },
    warning: { main: st.warning },
    error: { main: st.error },
    info: { main: st.info },
    edge: {
      border: s.border,
      raised: s.raised,
      control: s.control,
      tint: mode === 'paper' ? ch.tint : s.surface,
      stripes: { s1, s2, s3, s4, s5 },
      line: mode === 'paper' ? ch.paperStripes[2] : a.main,
      ghost: mode === 'paper' ? { hero: '0.22', word: '0.13' } : { hero: '0.14', word: '0.12' },
    },
  };
}

/**
 * Builds the MUI theme from tokens. Both modes live in one theme as CSS
 * variables (--edge-palette-*), switched by an attribute on <html>, so
 * changing mode restyles the page without re-rendering it. Everything a
 * screen needs (colors, text roles, component looks) is decided here;
 * screens pick a role or a variant instead of styling.
 */
export function createEdgeTheme(edge: EdgeName = 'orange'): Theme {
  const v = (path: string) => cssVar(path);
  const ring = `0 0 0 3px ${v('palette-background-default')}, 0 0 0 5px ${v('palette-primary-main')}`;
  const quick = `${motion.duration.quick}ms ${motion.ease.standard}`;

  const navLink = {
    display: 'inline-block',
    color: v('palette-text-primary'),
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    transition: `color ${quick}, border-color ${quick}`,
    '&:hover, &:focus-visible, &[aria-current="page"]': { color: v('palette-primary-main'), borderColor: v('palette-primary-main') },
  };

  return createTheme({
    cssVariables: { cssVarPrefix: CSS_VAR_PREFIX, colorSchemeSelector: `[${MODE_ATTRIBUTE}="%s"]` },
    colorSchemes: { dark: { palette: paletteFor('ink', edge) }, light: { palette: paletteFor('paper', edge) } },
    defaultColorScheme: 'dark',
    shape: { borderRadius: radius.md },
    transitions: {
      duration: { shortest: motion.duration.quick, shorter: motion.duration.quick, short: motion.duration.base, standard: motion.duration.base, complex: motion.duration.enter, enteringScreen: motion.duration.base, leavingScreen: motion.duration.quick },
      easing: { easeOut: motion.ease.enter, easeInOut: motion.ease.standard },
    },
    typography: {
      fontFamily: typography.body,
      fontSize: 14,
      // Headings follow my type study: a grotesque in sentence case, bold
      // set tight against light, with contrast coming from scale and weight
      // rather than capitals.
      h1: { fontFamily: typography.poster, fontStretch: '100%', fontWeight: 800, fontSize: 'clamp(2.4rem, 1.6rem + 3vw, 3.4rem)', lineHeight: 0.98, letterSpacing: '-0.025em' },
      h2: { fontFamily: typography.poster, fontStretch: '112%', fontWeight: 850, fontSize: 'clamp(2rem, 1.5rem + 1.8vw, 2.75rem)', lineHeight: 0.95, letterSpacing: '-0.015em', textTransform: 'uppercase' },
      h3: { fontFamily: typography.poster, fontStretch: '100%', fontWeight: 750, fontSize: '1.6rem', lineHeight: 1.08, letterSpacing: '-0.015em' },
      h4: { fontFamily: typography.poster, fontStretch: '100%', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.15, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700, fontSize: '1rem', lineHeight: 1.35 },
      h6: { fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.02em' },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.5 },
      // Section labels are small, bold and in the accent, like the colored
      // subheads in the type study.
      overline: { fontFamily: typography.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'none', lineHeight: 1.4 },
      button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0', fontSize: '0.9rem' },
      ...Object.fromEntries(roles.map((r) => [r, roleStyle(r)])),
    },
    components: {
      MuiTypography: { defaultProps: { variantMapping } },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: v('palette-background-default'),
            fontKerning: 'normal',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
          },
          // Headlines balance across lines; reading text avoids orphans.
          'h1, h2, h3, h4': { textWrap: 'balance' },
          p: { textWrap: 'pretty' },
          // Bold runs match the label weight, a step lighter than 700.
          'strong, b': { fontWeight: 650 },
          // Figures line up in columns wherever numbers are compared.
          'table, .tabular': { fontVariantNumeric: 'tabular-nums lining-nums' },
          '::selection': { background: v('palette-primary-main'), color: v('palette-primary-contrastText') },
          // A hairline over every section title that starts at a dot, as in
          // the type study, where rules hang from small round markers.
          'main h2.MuiTypography-h2': {
            position: 'relative',
            borderTop: `1px solid ${v('palette-text-primary')}`,
            paddingTop: 16,
            '&::before': { content: '""', position: 'absolute', left: 0, top: -5, width: 9, height: 9, borderRadius: '50%', background: v('palette-primary-main') },
          },
          // One consistent, high-visibility focus style for keyboard users.
          // Links and other focusable elements get a solid outline; MUI controls use the ring below.
          ':focus-visible': { outline: `3px solid ${v('palette-primary-main')}`, outlineOffset: 3 },
          '.MuiButtonBase-root:focus-visible, .MuiInputBase-input:focus-visible': { outline: 'none' },
          // Scrollable regions are focusable so keyboard users can scroll them.
          'pre[tabindex]': { overflowX: 'auto' },
        },
      },
      MuiButtonBase: { styleOverrides: { root: { '&.Mui-focusVisible': { boxShadow: ring } } } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.sm, paddingInline: 18, minHeight: 44,
            // Hover fills, press settles 1px: feedback that answers the hand, nothing more.
            transition: `background-color ${quick}, color ${quick}, border-color ${quick}, transform ${quick}`,
            '&:active': { transform: 'translateY(1px)' },
            [motion.reduced]: { transition: 'none', '&:active': { transform: 'none' } },
          },
          outlined: {
            borderWidth: 2, borderColor: v('palette-text-primary'),
            '&:hover': { borderWidth: 2, backgroundColor: v('palette-text-primary'), color: v('palette-background-default'), borderColor: v('palette-text-primary') },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          // Links set as a call to action read as labels, not running text.
          root: {
            textUnderlineOffset: '0.18em',
            // The current page in a navigation list is marked in the accent.
            '&[aria-current="page"]': { color: v('palette-primary-main') },
          },
        },
        variants: [
          // A whole block as a link (a row in a contents list): it keeps the
          // text color and lights up in the accent on hover and focus.
          {
            props: { underline: 'none', color: 'inherit' },
            style: { '&:hover, &:focus-visible': { color: v('palette-primary-main') } },
          },
          // Navigation (sections in the masthead, pages as tabs inside a
          // section): a bar under the current page and under the hovered link.
          { props: { variant: 'nav' }, style: { ...navLink, paddingBlock: 6 } },
          { props: { variant: 'tab' }, style: { ...navLink, paddingBottom: 4 } },
        ],
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderColor: v('palette-edge-border'), borderRadius: radius.lg } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: v('palette-edge-control') },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: v('palette-text-primary') },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: v('palette-primary-main'), borderWidth: 2 },
          },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 2 } } },
      MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: v('palette-text-primary'), color: v('palette-background-default'), fontSize: 12.8 } } },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            // Unselected options use the muted text color, which meets 4.5:1; MUI's default is a
            // translucent black that falls just short on Paper.
            color: v('palette-text-secondary'),
            transition: `background-color ${quick}, color ${quick}`,
            [motion.reduced]: { transition: 'none' },
          },
          // Small groups sit in toolbars and headers: tighter, so they line up with the text.
          sizeSmall: { padding: '2px 10px' },
        },
      },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', letterSpacing: 0, fontSize: '0.92rem', fontWeight: 700, minHeight: 48 } } },
      MuiTabs: { styleOverrides: { indicator: { height: 3 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: radius.lg, border: `2px solid ${v('palette-text-primary')}` } } },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: v('palette-text-primary'), fontSize: '0.8rem', borderBottom: `1px solid ${v('palette-text-primary')}` },
          root: { borderColor: v('palette-edge-border') },
        },
      },
    },
  });
}

/** Palette values for a mode, for code that needs real colors (canvas, contrast math, SVG). */
export function edgePalette(mode: Mode, edge: EdgeName) {
  return paletteFor(mode, edge) as Required<Pick<PaletteOptions, 'edge'>> & PaletteOptions;
}
