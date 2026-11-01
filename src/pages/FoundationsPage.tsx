import {
  Box, Chip, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { EdgeCard, StitchDivider } from '../components/EdgeCard';
import { useEdgeSettings } from '../theme/EdgeThemeProvider';
import { contrastRatio, wcagLevel } from '../tokens/contrast';
import { chapters, edgeColor, edgeLabel, edges, space, surfacesFor, typography, type EdgeName } from '../tokens/tokens';
import { img } from '../data/studio';
import { Lead } from '../components/type/Lead';
import { GhostWord, OutlineEcho, PageHero, posterSx } from '../components/type/Display';

function Swatch({ name, color, against, note, nonText = false }: { name: string; color: string; against: string; note: string; nonText?: boolean }) {
  const ratio = contrastRatio(color, against);
  // Controls and borders need 3:1 (WCAG 1.4.11); text needs 4.5:1 (1.4.3).
  const level = nonText ? (ratio >= 3 ? 'Pass 3:1' : 'Fail') : wcagLevel(ratio);
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
      <Box aria-hidden="true" sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: color, border: 1, borderColor: 'divider', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" component="p">{name}</Typography>
        <Typography variant="body2" color="text.secondary">{color.toUpperCase()} · {note}</Typography>
      </Box>
      <Chip
        size="small"
        variant="outlined"
        label={`${ratio.toFixed(1)}:1 ${level}`}
        color={level === 'Fail' ? 'error' : level === 'AA large' ? 'warning' : 'success'}
      />
    </Stack>
  );
}

/** A cover-style plate: photo, a bar of the accent, and type that crosses both. */
function CoverPlate() {
  return (
    <Box
      component="figure"
      sx={{
        m: 0,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
        height: { md: 480 },
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'primary.main',
      }}
    >
      <Box
        component="img"
        src={img('leather/edge-color-collection.jpg')}
        alt="A stack of navy leather wallets, each with a different painted edge: orange, green and red"
        sx={{ width: '100%', height: '100%', minHeight: 280, objectFit: 'cover', display: 'block' }}
      />
      <Box sx={{ color: 'primary.contrastText', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 3 }}>
        <Typography sx={{ fontFamily: typography.display, fontStyle: 'italic', fontSize: '1.35rem', lineHeight: 1.3, maxWidth: '22ch' }}>
          Dark hides, five edge paints, one rule: the edge is the only loud thing.
        </Typography>
        <Box
          aria-hidden="true"
          sx={{
            ...posterSx(62, 900),
            fontSize: { xs: '5.5rem', md: '9.5rem' },
            lineHeight: 0.8,
            ml: { md: '-0.62em' },
            mixBlendMode: 'normal',
          } as object}
        >
          <OutlineEcho offset="0.07em">EDGE</OutlineEcho>
        </Box>
        <Typography component="figcaption" variant="body2" sx={{ opacity: 0.9 }}>
          Edge-painted wallets from my workbench.
        </Typography>
      </Box>
    </Box>
  );
}

/** A type specimen set like a poster: one word across the grotesque's widths, against Garamond italic. */
function TypePoster() {
  const widths = [62, 75, 90, 110, 125];
  return (
    <EdgeCard sx={{ p: { xs: 3, md: 5 }, overflow: 'hidden' }}>
      <Grid container spacing={4} alignItems="flex-end">
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="overline" color="primary">poster · Archivo, width 62 to 125</Typography>
          <Box aria-hidden="true" sx={{ mt: 1 }}>
            {widths.map((w, i) => (
              <Box
                key={w}
                sx={{
                  ...posterSx(w, 300 + i * 150),
                  fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.4rem' },
                  lineHeight: 0.92,
                  whiteSpace: 'nowrap',
                  color: i === widths.length - 1 ? 'primary.main' : 'text.primary',
                } as object}
              >
                Stitch
              </Box>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            One variable font, five settings: width and weight change together from condensed light to expanded black.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="overline" color="primary">text · EB Garamond</Typography>
          <Typography
            aria-hidden="true"
            sx={{ fontFamily: typography.display, fontStyle: 'italic', fontSize: { xs: '6rem', md: '9rem' }, lineHeight: 0.85, mt: 1, color: 'text.primary' }}
          >
            Aa<Box component="span" sx={{ color: 'primary.main' }}>&</Box>
          </Typography>
          <Typography sx={{ fontFamily: typography.display, fontSize: '1.35rem', mt: 2, lineHeight: 1.4 }}>
            <Box component="span" sx={{ fontVariantCaps: 'all-small-caps', letterSpacing: '0.06em' }}>Small caps,</Box>{' '}
            <em>italics</em> and old-style figures 1234567890.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Interface · Inter, with tabular figures: <span className="tabular">$180 · $85 · $340</span>
          </Typography>
        </Grid>
      </Grid>
    </EdgeCard>
  );
}

export function FoundationsPage() {
  const { mode, edge } = useEdgeSettings();
  const s = surfacesFor(mode, edge);

  return (
    <Stack spacing={6}>
      <PageHero folio="one" label="Ground" bold="Dark hide," italic="one bright edge.">
        <Lead opening="Edge takes its look">
          from my leather work: quiet navy and black surfaces, with a single painted edge color that gives each
          piece its character. Pick an edge color above and the whole system follows. The paper mode is set like
          a luxury catalog in ivory and gold leaf.
        </Lead>
      </PageHero>

      <EdgeCard sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="overline" color="primary">what Edge is</Typography>
        <Typography variant="h3" component="h2" sx={{ mt: 0.5, mb: 2 }}>A design system, shown working</Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography sx={{ maxWidth: typography.measure }}>
              A design system is the shared set of colors, type, spacing and components a product team builds every
              screen from, so the product stays consistent and accessible as it grows. Edge is one I designed and
              built in React, TypeScript and MUI. Its look comes from my leather work and my training in book design,
              and my own leather goods and paintings serve as the sample content.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
              <li><b>Foundations:</b> the colors, type and spacing everything is built from</li>
              <li><b>Components:</b> the reusable parts, all usable by keyboard</li>
              <li><b>Studio:</b> a real screen built only from those parts</li>
              <li><b>AI patterns:</b> how to present AI output people can trust</li>
            </Stack>
          </Grid>
        </Grid>
      </EdgeCard>

      <CoverPlate />

      <Box component="section" aria-labelledby="color-heading" sx={{ position: 'relative', '& > :not([aria-hidden])': { position: 'relative', zIndex: 1 } }}>
        <GhostWord word="INK" align="right" />
        <Typography id="color-heading" variant="h2" sx={{ mb: 1 }}>Color</Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: typography.measure }}>
          Every ratio below is calculated live from the tokens. The same pairs are checked in automated tests, so a
          color change that breaks WCAG AA fails the build.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <EdgeCard sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" component="h3" sx={{ mb: 1 }}>{mode === 'ink' ? 'Ink' : 'Paper'} surfaces</Typography>
              <Swatch name="Primary text" color={s.text} against={s.background} note="on background" />
              <Swatch name="Secondary text" color={s.muted} against={s.background} note="on background" />
              <Swatch name="Control outline" color={s.control} against={s.surface} note="input borders, needs 3:1" nonText />
              <Swatch name="Surface" color={s.surface} against={s.text} note="cards and app bar" />
              <Swatch name="Background" color={s.background} against={s.text} note={mode === 'paper' ? 'ivory stock' : 'page'} />
              {mode === 'paper' && <Swatch name="Chapter tint" color={chapters[edge].tint} against={s.text} note="page openers" />}
            </EdgeCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EdgeCard sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" component="h3" sx={{ mb: 1 }}>Edge colors</Typography>
              {(Object.keys(edges) as EdgeName[]).map((name) => {
                const c = edgeColor(name, mode);
                return (
                  <Swatch
                    key={name}
                    name={`${edgeLabel(name, mode)}${name === edge ? ' (active)' : ''}`}
                    color={c}
                    against={s.background}
                    note="as text on background"
                  />
                );
              })}
            </EdgeCard>
          </Grid>
        </Grid>
      </Box>

      <StitchDivider aria-hidden="true" />

      <Box component="section" aria-labelledby="type-heading" sx={{ position: 'relative', '& > :not([aria-hidden])': { position: 'relative', zIndex: 1 } }}>
        <GhostWord word="TYPE" align="right" />
        <Typography id="type-heading" variant="h2" sx={{ mb: 1 }}>Type</Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: typography.measure }}>
          Set the way I set my type study: contrast does the work. Archivo, a variable grotesque, runs from
          hairline to black, so headlines pair a heavy line with a light one at poster scale. EB Garamond carries
          the reading text and chapter marks, with true small caps. Inter handles interface labels and numbers.
          Reading text holds to about 66 characters a line.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TypePoster />
          </Grid>
          <Grid size={12}>
            <EdgeCard sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {([
                  ['h1', 'Display, 49px', 'Hand-stitched, edge-painted'],
                  ['h2', 'Heading 2, 39px', 'A wallet in navy hide'],
                  ['h3', 'Heading 3, 31px', 'Orange edge, saddle stitch'],
                  ['h4', 'Heading 4, 22px', 'Made to order in four weeks'],
                  ['body1', 'Body, 16px', 'Each edge is beveled, sanded, painted and burnished by hand in several coats until it is smooth to the touch.'],
                  ['body2', 'Small, 14px', 'Secondary text for labels, captions and metadata.'],
                ] as const).map(([variant, label, sample]) => (
                  <Grid container key={variant} spacing={2} alignItems="baseline">
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Typography variant={variant} component="p">{sample}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </EdgeCard>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <EdgeCard sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="overline" color="primary">a page of reading text</Typography>
              <Lead opening="Every edge begins" sx={{ mt: 1.5, fontSize: '1.2rem' }}>
                rough from the knife. It is beveled to soften the corner, sanded through finer and finer grits, then
                painted in thin coats, each one dried and sanded again. Burnishing with canvas and wax closes the
                surface until the color sits flush with the leather, like a line drawn around the piece.
              </Lead>
              <Typography aria-hidden="true" sx={{ fontFamily: typography.display, fontStyle: 'italic', color: 'text.secondary', mt: 'auto', pt: 3, textAlign: 'center', fontSize: '1.05rem' }}>
                thirteen
              </Typography>
            </EdgeCard>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <EdgeCard sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <Typography variant="overline" color="primary">details that matter</Typography>
              <Stack component="dl" spacing={1.75} sx={{ m: 0, mt: 1.5, '& dt': { fontWeight: 600 }, '& dd': { m: 0, color: 'text.secondary' } }}>
                <div>
                  <dt>True small caps</dt>
                  <dd><Box component="span" sx={{ fontFamily: typography.display, fontVariantCaps: 'all-small-caps', letterSpacing: '0.06em', fontSize: '1.15rem', color: 'text.primary' }}>Saddle stitch, 8 spi</Box>, drawn from the font, not shrunken capitals.</dd>
                </div>
                <div>
                  <dt>Aligned figures</dt>
                  <dd className="tabular">Prices and dates line up in columns: $180 · $85 · $340</dd>
                </div>
                <div>
                  <dt>Real punctuation</dt>
                  <dd>Curly quotes “like these,” apostrophes in can’t, and en dashes for ranges, 3–4 weeks.</dd>
                </div>
                <div>
                  <dt>Balanced headings</dt>
                  <dd>Headlines balance across lines and paragraphs avoid one-word last lines.</dd>
                </div>
              </Stack>
            </EdgeCard>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" aria-labelledby="space-heading" sx={{ position: 'relative', '& > :not([aria-hidden])': { position: 'relative', zIndex: 1 } }}>
        <GhostWord word="GRID" align="right" />
        <Typography id="space-heading" variant="h2" sx={{ mb: 3 }}>Spacing</Typography>
        <EdgeCard sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            {space.slice(1).map((px) => (
              <Stack key={px} direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ width: 48 }}>{px}px</Typography>
                <Box aria-hidden="true" sx={{ height: 12, width: px * 3, bgcolor: 'primary.main', borderRadius: 0.5 }} />
              </Stack>
            ))}
          </Stack>
        </EdgeCard>
      </Box>
    </Stack>
  );
}
