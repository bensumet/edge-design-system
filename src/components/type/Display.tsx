import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { typography } from '../../tokens/tokens';

/**
 * Expressive display pieces, each drawn from my print work:
 *
 * - Chapter openers from a 600-page guide: a full-bleed tint with a stack of
 *   related colors striped down the fore-edge and a small solid square.
 * - Swiss typography from a type study: bold set against light, huge against
 *   tiny, hairline rules hung from small dots, labels in solid color boxes.
 * - Geometric compositions from my wall art: circles, rings, hanging lines.
 *
 * Everything decorative is aria-hidden; the real words exist once as text.
 */

const visuallyHidden = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap' as const,
};

/** Poster-scale grotesque. */
export const posterSx = (stretch = 75, weight = 800): SxProps<Theme> => ({
  fontFamily: typography.poster,
  fontStretch: `${stretch}%`,
  fontWeight: weight,
  textTransform: 'uppercase',
  letterSpacing: '-0.01em',
  lineHeight: 0.86,
});

/** Text with an outlined copy offset behind it. */
export function OutlineEcho({ children, offset = '0.06em', sx }: { children: string; offset?: string; sx?: SxProps<Theme> }) {
  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-block', ...sx } as SxProps<Theme>}>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          position: 'absolute', left: offset, top: offset, color: 'transparent',
          WebkitTextStroke: '1.5px', WebkitTextStrokeColor: 'currentcolor', opacity: 0.55,
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Box>
      <Box component="span" sx={{ position: 'relative' }}>{children}</Box>
    </Box>
  );
}

/**
 * The fore-edge of a chapter: five stripes of related color, side by side,
 * in uneven widths, as printed on the edge of each chapter opener.
 */
export function ChapterStripes({ direction = 'vertical', sx }: { direction?: 'vertical' | 'horizontal'; sx?: SxProps<Theme> }) {
  const t = useTheme();
  const { s1: a, s2: b, s3: c, s4: d, s5: e } = t.vars.palette.edge.stripes;
  const stops = [`${a} 0 14%`, `${b} 14% 34%`, `${c} 34% 62%`, `${d} 62% 78%`, `${e} 78% 100%`].join(', ');
  return (
    <Box
      aria-hidden="true"
      sx={{
        background: `linear-gradient(${direction === 'vertical' ? '90deg' : '180deg'}, ${stops})`,
        ...sx,
      } as SxProps<Theme>}
    />
  );
}

/** A small label in a solid color box, as the company names in the type study. */
export function Tag({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        fontFamily: typography.body,
        fontWeight: 700,
        fontSize: '0.78rem',
        lineHeight: 1,
        px: 0.9,
        py: 0.6,
        ...sx,
      } as SxProps<Theme>}
    >
      {children}
    </Box>
  );
}

/** A hairline that hangs from a dot and ends in a dot. */
export function DotRule({ sx }: { sx?: SxProps<Theme> }) {
  const dot = { content: '""', position: 'absolute', top: -3.5, width: 8, height: 8, borderRadius: '50%' };
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        height: '1px',
        bgcolor: 'text.primary',
        '&::before': { ...dot, left: 0, bgcolor: 'primary.main' },
        '&::after': { ...dot, right: 0, bgcolor: 'text.primary', width: 6, height: 6, top: -2.5 },
        ...sx,
      } as SxProps<Theme>}
    />
  );
}

export type WallArtVariant = 'planets' | 'rings' | 'verticals' | 'arrows';

/**
 * Compositions after my wall art: a stack of circles on a ground line,
 * rings hanging on threads, bars crossed by a disc, arrows on fine lines.
 */
export function WallArt({ variant, sx }: { variant: WallArtVariant; sx?: SxProps<Theme> }) {
  // Colors are CSS variables, so they go in style, not in SVG attributes.
  const t = useTheme();
  const { s1, s2, s3, s4, s5 } = t.vars.palette.edge.stripes;
  const ink = t.vars.palette.text.primary;
  const f = (c: string) => ({ style: { fill: c } });
  const line = { style: { stroke: ink, fill: 'none' }, strokeWidth: 0.8 };
  const ring = (c: string, w: number) => ({ style: { stroke: c, fill: 'none' }, strokeWidth: w });

  const art: Record<WallArtVariant, React.ReactNode> = {
    planets: (
      <>
        <circle cx="132" cy="134" r="52" {...f(ink)} />
        <circle cx="70" cy="96" r="26" {...f(s2)} />
        <circle cx="104" cy="44" r="13" {...f(s4)} />
        <circle cx="48" cy="40" r="8" {...f(s1)} />
        <circle cx="160" cy="70" r="6" {...f(s3)} />
        <circle cx="146" cy="156" r="10" {...f(s1)} />
        <line x1="14" y1="190" x2="196" y2="190" {...ring(ink, 4)} />
      </>
    ),
    rings: (
      <>
        <line x1="54" y1="0" x2="54" y2="92" {...line} />
        <circle cx="54" cy="110" r="18" {...ring(s4, 3)} />
        <line x1="104" y1="0" x2="104" y2="40" {...line} />
        <circle cx="104" cy="70" r="30" {...ring(ink, 3)} />
        <circle cx="122" cy="52" r="5" {...f(s2)} />
        <line x1="150" y1="0" x2="150" y2="128" {...line} />
        <circle cx="150" cy="158" r="30" {...ring(s3, 4)} />
        <circle cx="160" cy="176" r="5" {...f(ink)} />
      </>
    ),
    verticals: (
      <>
        <rect x="42" y="0" width="7" height="200" {...f(s2)} />
        <rect x="62" y="0" width="7" height="200" {...f(s4)} />
        <rect x="104" y="0" width="7" height="200" {...f(s1)} />
        <circle cx="112" cy="78" r="50" {...f(ink)} />
        <circle cx="70" cy="160" r="9" {...f(s3)} />
        <line x1="0" y1="190" x2="200" y2="190" {...line} />
      </>
    ),
    arrows: (
      <>
        {[36, 78, 120, 162].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="0" x2={x} y2="200" {...line} />
            {[50 + i * 22, 112 + i * 14].map((y, j) => (
              <path key={y} d={`M${x - 7} ${y + 10} L${x} ${y} L${x + 7} ${y + 10} Z`} {...f([s2, ink, s4, s3][(i + j) % 4])} />
            ))}
          </g>
        ))}
        <circle cx="120" cy="30" r="6" {...f(s5)} />
      </>
    ),
  };

  return (
    <Box aria-hidden="true" sx={{ ...sx } as SxProps<Theme>}>
      <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
        {art[variant]}
      </svg>
    </Box>
  );
}

const artFor: Record<string, WallArtVariant> = { one: 'planets', two: 'rings', three: 'verticals', four: 'arrows' };
const numerals: Record<string, string> = { one: '01', two: '02', three: '03', four: '04', five: '05', six: '06' };

export interface PageHeroProps {
  /** Page number, written out like a book folio: "one", "two". */
  folio: string;
  /** The chapter word, shown in the color box and set huge behind the page. */
  label: string;
  /** The bold first line of the title. */
  bold: string;
  /** The Garamond italic second line of the title. */
  italic: string;
  /** Wall-art composition; chosen from the folio when omitted. */
  art?: WallArtVariant;
  children?: React.ReactNode;
}

/**
 * Page opener, set like a chapter opener: the page is washed in the chapter
 * tint with the striped fore-edge and the chapter mark set vertically in
 * Garamond. The headline sets heavy condensed grotesque against Garamond
 * italic, with a huge pale word behind and a wall-art composition beside it.
 */
export function PageHero(props: PageHeroProps) {
  return <SpreadHero {...props} />;
}

function HeroTitle({ folio, bold, italic }: Pick<PageHeroProps, 'folio' | 'bold' | 'italic'>) {
  return (
    <Box component="h1" sx={{ m: 0, textWrap: 'balance' }}>
      <Box
        component="span"
        sx={{
          display: 'block',
          fontFamily: typography.poster,
          fontStretch: '72%',
          fontWeight: 850,
          textTransform: 'uppercase',
          fontSize: 'clamp(3.1rem, 1.2rem + 7.2vw, 7.6rem)',
          lineHeight: 0.86,
          letterSpacing: '-0.01em',
          color: 'text.primary',
        }}
      >
        {bold}
      </Box>
      <Box
        component="span"
        sx={{
          display: 'block',
          fontFamily: typography.display,
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(2.5rem, 1rem + 5.4vw, 5.8rem)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'primary.main',
          mt: { xs: 0.5, md: 1 },
        }}
      >
        {italic}
      </Box>
      <Box component="span" sx={visuallyHidden}>, chapter {folio}</Box>
    </Box>
  );
}

const spaced = {
  fontFamily: typography.body,
  fontSize: '0.62rem',
  fontWeight: 600,
  letterSpacing: '0.5em',
  textTransform: 'uppercase' as const,
};

/**
 * Page opener after my Space and Place book study, used in every mode:
 * letterspaced running heads across the top, a narrow edge column (the
 * chapter stripes) with a vertical caption,
 * a two-voice headline, and a fine rule that branches like a diagram to two
 * small labels. A wall-art composition sits beside the lead.
 */
function SpreadHero({ folio, label, bold, italic, art, children }: PageHeroProps) {
  const t = useTheme();
  const column = { xs: 14, md: 64 };
  const label2 = { ...spaced, letterSpacing: '0.3em', fontWeight: 800 };
  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'edge.tint',
        borderStyle: 'solid',
        borderColor: 'divider',
        borderWidth: 0,
        ...t.applyStyles('dark', { borderWidth: 1 }),
        minHeight: { xs: 500, md: 640 },
        isolation: 'isolate',
      }}
    >
      {/* Edge column: the chapter stripes. */}
      <ChapterStripes sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: column }} />

      {/* One pale word, set light and vertical, down the far edge. */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          display: { xs: 'none', sm: 'block' },
          right: { sm: -18, md: -22 },
          top: { xs: 44, md: 52 },
          writingMode: 'vertical-rl',
          fontFamily: typography.poster,
          fontWeight: 200,
          fontSize: { xs: '5rem', md: '9.5rem' },
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          textTransform: 'lowercase',
          whiteSpace: 'nowrap',
          color: 'edge.line',
          opacity: t.vars.palette.edge.ghost.hero,
          zIndex: -1,
          userSelect: 'none',
        }}
      >
        {label}
      </Box>

      {/* Running heads, letterspaced across the top. */}
      <Box
        aria-hidden="true"
        sx={{ position: 'absolute', top: 20, left: { xs: 36, md: 100 }, right: { xs: 16, md: 36 }, display: 'flex', ...spaced, color: 'text.secondary' }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '22%' }}>Edge</Box>
        <Box sx={{ flex: 1 }}>{label}</Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '30%' }}>Design system</Box>
        <Box sx={{ letterSpacing: 0, fontWeight: 700, color: 'text.primary' }}>{numerals[folio] ?? folio}</Box>
      </Box>

      {/* Vertical caption beside the edge column. */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 80,
          bottom: 40,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          ...spaced,
          letterSpacing: '0.38em',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        Edge design system · chapter {folio} · {label}
      </Box>

      {/* Wall-art composition beside the lead. */}
      <WallArt
        variant={art ?? artFor[folio] ?? 'planets'}
        sx={{
          display: { xs: 'none', sm: 'block' },
          position: 'absolute',
          zIndex: -1,
          right: { sm: 96, md: 150 },
          bottom: { sm: 28, md: 40 },
          width: { sm: 160, md: 230 },
          height: { sm: 160, md: 230 },
        }}
      />

      <Box sx={{ position: 'relative', pl: { xs: 4.5, md: 17 }, pr: { xs: 2.5, sm: 9, md: 16 }, pt: { xs: 9, md: 14 } }}>
        <HeroTitle folio={folio} bold={bold} italic={italic} />

        {/* A branching rule, as the diagrams linking BUSINESS and GOVERNMENT. */}
        <Box aria-hidden="true" sx={{ position: 'relative', height: { xs: 70, md: 90 }, mt: { xs: 2, md: 3 }, ml: { md: '1%' }, width: { xs: '100%', sm: '62%' } }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0, height: 32, width: '1px', bgcolor: 'edge.line' }} />
          <Box sx={{ position: 'absolute', left: 0, right: 0, top: 32, height: '1px', bgcolor: 'edge.line' }} />
          <Box sx={{ position: 'absolute', left: '50%', top: 32, height: 24, width: '1px', bgcolor: 'edge.line' }} />
          <Box sx={{ position: 'absolute', right: 0, top: 32, height: 24, width: '1px', bgcolor: 'edge.line' }} />
          <Box sx={{ position: 'absolute', left: '50%', top: 62, ...label2, color: 'primary.main', transform: 'translateX(-50%)' }}>Design</Box>
          <Box sx={{ position: 'absolute', right: '-0.3em', top: 62, ...label2, color: 'text.primary' }}>Code</Box>
        </Box>

        <Box sx={{ mt: { xs: 2, md: 3 }, ml: { md: '10%' }, maxWidth: { xs: '100%', sm: 'calc(100% - 270px)', md: 520 }, pb: { xs: 4, md: 7 } }}>{children}</Box>
      </Box>
    </Box>
  );
}

/**
 * A huge, pale word set light behind a section, after the oversized
 * "info guide" set in pale color under the type study's text.
 */
export function GhostWord({ word, align = 'left', sx }: { word: string; align?: 'left' | 'right'; sx?: SxProps<Theme> }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        top: { xs: -26, md: -62 },
        [align]: { xs: -6, md: -16 },
        fontFamily: typography.poster,
        fontWeight: 200,
        fontSize: { xs: '6rem', md: '12rem' },
        lineHeight: 0.8,
        letterSpacing: '-0.05em',
        textTransform: 'lowercase',
        color: 'primary.main',
        opacity: (t: Theme) => t.vars.palette.edge.ghost.word,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        ...sx,
      } as SxProps<Theme>}
    >
      {word}
    </Box>
  );
}

/** Small running head, like the top margin of a book page. */
export function RunningHead({ left, right }: { left: string; right: string }) {
  return (
    <Box aria-hidden="true" sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <Tag>{left}</Tag>
      <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>{right}</Typography>
    </Box>
  );
}

/** A hairline rule with an arrowhead, as used to link notes to text in the book studies. */
export function ArrowRule({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        height: '1px',
        bgcolor: 'primary.main',
        '&::after': {
          content: '""', position: 'absolute', right: -1, top: -4,
          borderLeft: '7px solid', borderLeftColor: 'primary.main',
          borderTop: '4.5px solid transparent', borderBottom: '4.5px solid transparent',
        },
        ...sx,
      } as SxProps<Theme>}
    />
  );
}
