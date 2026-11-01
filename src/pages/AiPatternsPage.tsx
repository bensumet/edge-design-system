import { useState } from 'react';
import {
  Box, Button, Stack, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Lead } from '../components/type/Lead';
import { PageHero } from '../components/type/Display';
import { EdgeCard, StitchDivider } from '../components/EdgeCard';
import { AiLabel } from '../components/ai/AiLabel';
import { StreamingText } from '../components/ai/StreamingText';
import { SuggestionList } from '../components/ai/SuggestionList';
import { SummaryCard } from '../components/ai/SummaryCard';
import { img } from '../data/studio';
import { useEdgeSettings } from '../theme/EdgeThemeProvider';
import { edgeColor, edges, typography } from '../tokens/tokens';

function Pattern({ id, title, principle, children }: { id: string; title: string; principle: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <Typography id={id} variant="h3" component="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: typography.measure }}>{principle}</Typography>
      {children}
    </section>
  );
}

const description =
  'A slim bifold cut from navy vegetable-tanned leather, saddle stitched by hand with waxed thread. ' +
  'The edges are beveled, sanded and painted orange in three coats, then burnished until smooth, so the ' +
  'color frames the wallet without wearing off. Six card slots, a full-length bill pocket and a quiet ' +
  'maker’s mark inside. It softens and darkens with use.';

function CaptionEditor() {
  const draft = 'A single pink rose in a glass bottle, caught in a slanted beam of late light against a dusky wall.';
  const [value, setValue] = useState(draft);
  const [saved, setSaved] = useState(false);
  const edited = value !== draft;

  return (
    <EdgeCard sx={{ p: 0 }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            component="img"
            src={img('paintings/rose-in-vase.jpg')}
            alt="Digital painting of a pink rose in a clear glass bottle on a dusky rose background"
            sx={{ width: '100%', height: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4" component="h3" sx={{ mr: 'auto' }}>Gallery caption</Typography>
              {edited ? <Typography variant="body2" color="text.secondary">Edited by you</Typography> : <AiLabel />}
            </Stack>
            <TextField
              multiline
              minRows={3}
              label="Caption"
              value={value}
              onChange={(e) => { setValue(e.target.value); setSaved(false); }}
              helperText={`${value.length} / 160 characters`}
              slotProps={{ htmlInput: { maxLength: 160 } }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => setSaved(true)}>Use caption</Button>
              <Button onClick={() => { setValue(draft); setSaved(false); }} disabled={!edited}>Revert to draft</Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" role="status">{saved && 'Caption saved to the painting.'}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </EdgeCard>
  );
}

export function AiPatternsPage() {
  const { mode } = useEdgeSettings();
  const c = (name: keyof typeof edges) => edgeColor(name, mode);

  return (
    <Stack spacing={6}>
      <Box>
        <PageHero folio="four" label="Machine" bold="AI that shows" italic="its work.">
          <Lead opening="Four patterns">
            for putting AI output in front of people. The rules are the same in each: label what the machine wrote,
            show where it came from, keep the person in control, and make it easy to say “that’s wrong.” Everything
            here runs on mock data.
          </Lead>
        </PageHero>
      </Box>

      <Pattern id="summary" title="Summary with sources" principle="A summary is only as useful as it is checkable. Each point cites the message it came from, and the sources open in place.">
        <SummaryCard
          title="Commission brief, CM-1043"
          points={[
            { text: 'Slim card holder in navy, purple edge, ready by November 12.', sources: ['m1'] },
            { text: 'Initials “J.P.” blind-embossed, no foil.', sources: ['m2'] },
            { text: 'Gift for a partner who carries few cards; holds four cards plus folded cash.', sources: ['m1', 'm3'] },
          ]}
          sources={[
            { id: 'm1', label: 'Message, Oct 20', excerpt: 'Navy with the purple edge like the one on your page, needed by the 12th.' },
            { id: 'm2', label: 'Message, Oct 21', excerpt: 'Could you emboss J.P.? Plain, no gold.' },
            { id: 'm3', label: 'Message, Oct 21', excerpt: 'It’s a gift. He only carries three or four cards and some folded cash.' },
          ]}
        />
      </Pattern>

      <StitchDivider aria-hidden="true" />

      <Pattern id="suggestions" title="Recommendations you approve" principle="Suggestions explain their reasoning and change nothing until accepted. Dismissing one can be undone.">
        <Typography variant="h4" component="h3" sx={{ mb: 2 }}>Edge colors for a navy wallet with natural thread</Typography>
        <SuggestionList
          suggestions={[
            { id: 's1', title: 'Orange', swatch: c('orange'), reason: 'The strongest contrast against navy, and it matches the Navy bifold already in your catalog.' },
            { id: 's2', title: 'Mint', swatch: c('mint'), reason: 'Cooler and quieter. A calmer frame for an everyday wallet that still reads clearly at the edge.' },
            { id: 's3', title: 'Purple', swatch: c('purple'), reason: 'A softer contrast for a dressier piece. It matches the Slim card holder in your catalog.' },
          ]}
        />
      </Pattern>

      <StitchDivider aria-hidden="true" />

      <Pattern id="streaming" title="Streaming with Stop" principle="Long drafts appear as they are written, and the person can stop at any point and keep what is there. Screen readers hear one announcement when it finishes, not every word.">
        <EdgeCard sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" component="h3" sx={{ mr: 'auto' }}>Product description, Navy bifold</Typography>
            <AiLabel />
          </Stack>
          <StreamingText text={description} placeholder="Press Generate to draft a product description from the piece’s details." />
        </EdgeCard>
      </Pattern>

      <StitchDivider aria-hidden="true" />

      <Pattern id="editable" title="Drafts you can own" principle="An AI draft is a starting point. Once someone edits it, the AI label steps aside, and the original is one click away.">
        <CaptionEditor />
      </Pattern>
    </Stack>
  );
}
