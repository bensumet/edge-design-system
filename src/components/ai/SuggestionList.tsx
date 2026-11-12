import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { EdgeCard } from '../EdgeCard';

export interface Suggestion {
  id: string;
  title: string;
  reason: string;
  swatch?: string;
}

export type Decision = 'accepted' | 'dismissed';

/**
 * AI recommendations the person stays in control of. Every suggestion shows
 * its reason, and nothing is applied until it is accepted. Dismissed items
 * can be restored, so a misclick is never final.
 */
export function SuggestionList({ suggestions, onDecide }: { suggestions: Suggestion[]; onDecide?: (id: string, decision: Decision | null) => void }) {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const decide = (id: string, d: Decision | undefined) =>
    setDecisions((prev) => {
      const next = { ...prev };
      if (d) next[id] = d;
      else delete next[id];
      return next;
    });
  const choose = (id: string, d: Decision | undefined) => { decide(id, d); onDecide?.(id, d ?? null); };

  return (
    <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {suggestions.map((s) => {
        const d = decisions[s.id];
        return (
          <EdgeCard component="li" key={s.id} sx={{ p: 2, opacity: d === 'dismissed' ? 0.6 : 1 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              {s.swatch && (
                <Box
                  aria-hidden="true"
                  sx={{ width: 36, height: 36, borderRadius: 1, flexShrink: 0, bgcolor: s.swatch, border: 1, borderColor: 'divider' }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" component="h4">{s.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.reason}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
                  {d ? (
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} role="status">
                        {d === 'accepted' ? 'Accepted' : 'Dismissed'}
                      </Typography>
                      <Button size="small" onClick={() => choose(s.id, undefined)}>Undo</Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" variant="outlined" onClick={() => choose(s.id, 'accepted')} aria-label={`Accept ${s.title}`}>
                        Accept
                      </Button>
                      <Button size="small" variant="text" onClick={() => choose(s.id, 'dismissed')} aria-label={`Dismiss ${s.title}`}>
                        Dismiss
                      </Button>
                    </>
                  )}
                </Stack>
              </Box>
            </Stack>
          </EdgeCard>
        );
      })}
    </Stack>
  );
}
