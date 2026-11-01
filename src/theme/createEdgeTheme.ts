import { createTheme, type Theme } from '@mui/material/styles';
import { accent, chapters, radius, status, surfacesFor, typography, type EdgeName, type Mode } from '../tokens/tokens';

export interface EdgePalette {
  border: string;
  raised: string;
  control: string;
  /** Opener tint: the chapter color in paper mode, the surface in ink mode. */
  tint: string;
  stripes: readonly string[];
  /** Fine connecting rules in page openers. */
  line: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    edge: EdgePalette;
  }
  interface PaletteOptions {
    edge?: EdgePalette;
  }
}

/**
 * Builds the MUI theme from tokens. Components never hard-code colors:
 * they read from the theme, so switching mode or edge color restyles the
 * whole product from one place.
 */
export function createEdgeTheme(mode: Mode, edge: EdgeName): Theme {
  const s = surfacesFor(mode, edge);
  const ch = chapters[edge];
  const a = accent(edge, mode);
  const st = status[mode];
  const focusRing = `0 0 0 3px ${s.background}, 0 0 0 5px ${a.main}`;

  return createTheme({
    palette: {
      mode: mode === 'ink' ? 'dark' : 'light',
      primary: { main: a.main, contrastText: a.on },
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
        stripes: mode === 'paper' ? ch.paperStripes : ch.stripes,
        line: mode === 'paper' ? ch.paperStripes[2] : a.main,
      },
    },
    shape: { borderRadius: radius.md },
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
      overline: {
        fontFamily: typography.body,
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'none',
        lineHeight: 1.4,
      },
      button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0', fontSize: '0.9rem' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: s.background,
            fontKerning: 'normal',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
          },
          // Headlines balance across lines; reading text avoids orphans.
          'h1, h2, h3, h4': { textWrap: 'balance' },
          p: { textWrap: 'pretty' },
          // Figures line up in columns wherever numbers are compared.
          'table, .tabular': { fontVariantNumeric: 'tabular-nums lining-nums' },
          '::selection': { background: a.main, color: a.on },
          // A hairline over every section title that starts at a dot, as in
          // the type study, where rules hang from small round markers.
          'main h2.MuiTypography-h2': {
            position: 'relative',
            borderTop: `1px solid ${s.text}`,
            paddingTop: 16,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: -5,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: a.main,
            },
          },
          // One consistent, high-visibility focus style for keyboard users.
          ':focus-visible': { outline: 'none' },
        },
      },
      MuiButtonBase: {
        defaultProps: { disableRipple: false },
        styleOverrides: { root: { '&.Mui-focusVisible': { boxShadow: focusRing } } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: radius.sm, paddingInline: 18, minHeight: 44 },
          outlined: { borderWidth: 2, borderColor: s.text, '&:hover': { borderWidth: 2 } },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderColor: s.border, borderRadius: radius.lg } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: s.control },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: s.text },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: a.main, borderWidth: 2 },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600, borderRadius: 2 } },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: s.text, color: s.background, fontSize: 12.8 },
        },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: 'none', letterSpacing: 0, fontSize: '0.92rem', fontWeight: 700, minHeight: 48 } },
      },
      MuiTabs: {
        styleOverrides: { indicator: { height: 3 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: radius.lg, border: `2px solid ${s.text}` } },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: s.text, fontSize: '0.8rem', borderBottom: `1px solid ${s.text}` },
          root: { borderColor: s.border },
        },
      },
    },
  });
}
