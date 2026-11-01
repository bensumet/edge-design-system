import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';

type Vote = 'up' | 'down' | null;

/**
 * Lightweight feedback on any AI output. A thumbs-down opens a short,
 * optional reason so the signal is useful, not just a number.
 */
export function FeedbackBar({ onSubmit }: { onSubmit?: (vote: Vote, note: string) => void }) {
  const [vote, setVote] = useState<Vote>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Typography variant="body2" color="text.secondary" role="status">
        Thanks. Your feedback helps tune these drafts.
      </Typography>
    );
  }

  const send = (v: Vote, n = '') => {
    onSubmit?.(v, n);
    setSent(true);
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" role="group" aria-label="Rate this draft">
        <Typography variant="body2" color="text.secondary">Was this useful?</Typography>
        <Button size="small" variant={vote === 'up' ? 'contained' : 'outlined'} aria-pressed={vote === 'up'} onClick={() => send('up')}>
          Yes
        </Button>
        <Button size="small" variant={vote === 'down' ? 'contained' : 'outlined'} aria-pressed={vote === 'down'} onClick={() => setVote('down')}>
          No
        </Button>
      </Stack>
      {vote === 'down' && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'flex-start' }}>
          <TextField
            size="small"
            label="What was wrong? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={() => send('down', note)}>Send</Button>
        </Stack>
      )}
    </Stack>
  );
}
