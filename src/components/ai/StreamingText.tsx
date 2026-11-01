import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';

type State = 'idle' | 'streaming' | 'stopped' | 'done';

export interface StreamingTextProps {
  /** The full text the mock model will "write". */
  text: string;
  /** Milliseconds per word. */
  speed?: number;
  /** Start streaming on mount. */
  autoStart?: boolean;
  /** Shown before the first run. */
  placeholder?: string;
}

/**
 * Streams a response word by word with Stop and Regenerate controls.
 * Screen readers get one polite announcement when the text is complete,
 * not a stream of fragments.
 */
export function StreamingText({ text, speed = 45, autoStart = false, placeholder = 'Press Generate to write a draft.' }: StreamingTextProps) {
  const words = text.split(' ');
  const [count, setCount] = useState(0);
  const [state, setState] = useState<State>('idle');
  const timer = useRef<number | undefined>(undefined);

  const clear = () => window.clearInterval(timer.current);

  const start = useCallback(() => {
    clear();
    setCount(0);
    setState('streaming');
    timer.current = window.setInterval(() => {
      setCount((c) => {
        if (c + 1 >= words.length) {
          clear();
          setState('done');
          return words.length;
        }
        return c + 1;
      });
    }, speed);
  }, [speed, words.length]);

  useEffect(() => {
    if (autoStart) start();
    return clear;
  }, [autoStart, start]);

  const stop = () => {
    clear();
    setState('stopped');
  };

  const shown = words.slice(0, count).join(' ');

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{ minHeight: 96, typography: 'body1', lineHeight: 1.65, maxWidth: '68ch' }}
        aria-busy={state === 'streaming'}
      >
        {state === 'idle' ? (
          <Typography color="text.secondary">{placeholder}</Typography>
        ) : (
          <>
            {shown}
            {state === 'streaming' && <Box component="span" aria-hidden="true" sx={{ color: 'primary.main' }}> ▍</Box>}
          </>
        )}
      </Box>
      {state === 'streaming' && <LinearProgress aria-label="Drafting" />}
      <Typography component="p" variant="body2" color="text.secondary" role="status" aria-live="polite">
        {state === 'done' && 'Draft complete.'}
        {state === 'stopped' && 'Stopped. The partial draft is kept.'}
      </Typography>
      <Stack direction="row" spacing={1}>
        {state === 'streaming' ? (
          <Button variant="outlined" onClick={stop}>Stop</Button>
        ) : (
          <Button variant="contained" onClick={start}>{state === 'idle' ? 'Generate' : 'Regenerate'}</Button>
        )}
      </Stack>
    </Stack>
  );
}
