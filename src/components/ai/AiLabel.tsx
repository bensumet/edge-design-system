import { Chip, Tooltip } from '@mui/material';

/** Marks content as machine-generated so people know to review it. */
export function AiLabel({ tip = 'Drafted by AI. Review before using.' }: { tip?: string }) {
  return (
    <Tooltip title={tip}>
      <Chip
        size="small"
        variant="outlined"
        color="primary"
        label={<span><span aria-hidden="true">✦ </span>AI draft</span>}
        tabIndex={0}
        aria-label={`AI draft. ${tip}`}
      />
    </Tooltip>
  );
}
