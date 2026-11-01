import { useId, useState } from 'react';
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import { EdgeCard } from '../EdgeCard';
import { AiLabel } from './AiLabel';
import { FeedbackBar } from './FeedbackBar';

export interface Source {
  id: string;
  label: string;
  excerpt: string;
}

export interface SummaryPoint {
  text: string;
  /** Ids of the sources this point is based on. */
  sources: string[];
}

/**
 * An AI summary that shows its work: each point cites the source it came
 * from, and the sources can be opened in place to check them.
 */
export function SummaryCard({ title, points, sources }: { title: string; points: SummaryPoint[]; sources: Source[] }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const index = (id: string) => sources.findIndex((s) => s.id === id) + 1;

  return (
    <EdgeCard painted sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4" component="h3">{title}</Typography>
        <AiLabel />
      </Stack>
      <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 1, lineHeight: 1.6 } }}>
        {points.map((p) => (
          <li key={p.text}>
            {p.text}{' '}
            {p.sources.map((s) => (
              <Box component="sup" key={s} sx={{ color: 'primary.main', fontWeight: 600 }} aria-label={`source ${index(s)}`}>
                [{index(s)}]
              </Box>
            ))}
          </li>
        ))}
      </Box>
      <Button size="small" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={regionId} sx={{ mt: 1 }}>
        {open ? 'Hide sources' : `Show ${sources.length} sources`}
      </Button>
      <Collapse in={open}>
        <Box id={regionId} component="ol" sx={{ pl: 2.5, mt: 1, color: 'text.secondary', '& li': { mb: 1 } }}>
          {sources.map((s) => (
            <li key={s.id}>
              <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{s.label}: </Typography>
              <Typography component="span" variant="body2">“{s.excerpt}”</Typography>
            </li>
          ))}
        </Box>
      </Collapse>
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <FeedbackBar />
      </Box>
    </EdgeCard>
  );
}
