import { Box, Stack, Typography } from '@mui/material';

export interface RailStep {
  label: string;
  detail?: string;
  meta?: string;
}

/**
 * A vertical process rail: a hairline rule with a marker for each step,
 * small accent labels and aligned details. Adapted from an information-design
 * study (a customer information guide) set on a single vertical rule.
 *
 * Progress is shown three ways so it never depends on color alone: filled
 * versus hollow markers, a "current" word, and an ordered list that screen
 * readers announce as "step n of total".
 */
export function ProcessRail({ steps, current, title }: { steps: RailStep[]; current: number; title: string }) {
  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Typography component="figcaption" variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      <Box
        component="ol"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 7,
            top: 8,
            bottom: 8,
            width: '1px',
            bgcolor: 'text.secondary',
            opacity: 0.6,
          },
        }}
      >
        {steps.map((step, i) => {
          const done = i < current;
          const now = i === current;
          return (
            <Stack
              component="li"
              key={step.label}
              direction="row"
              spacing={2}
              sx={{ position: 'relative', pb: i === steps.length - 1 ? 0 : 2.5 }}
              aria-current={now ? 'step' : undefined}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 15,
                  height: 15,
                  mt: '3px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  zIndex: 1,
                  border: 2,
                  borderColor: 'primary.main',
                  bgcolor: done || now ? 'primary.main' : 'background.paper',
                  boxShadow: now ? (t) => `0 0 0 4px ${t.palette.background.paper}, 0 0 0 5px ${t.palette.primary.main}` : 'none',
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1.5} alignItems="baseline" justifyContent="space-between">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {step.label}
                    {now && (
                      <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600, ml: 1 }}>
                        current
                      </Typography>
                    )}
                    {done && <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}> (done)</Box>}
                  </Typography>
                  {step.meta && (
                    <Typography variant="body2" color="text.secondary" className="tabular" sx={{ flexShrink: 0 }}>
                      {step.meta}
                    </Typography>
                  )}
                </Stack>
                {step.detail && <Typography variant="body2" color="text.secondary">{step.detail}</Typography>}
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
