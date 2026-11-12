import { Card, type CardProps } from '@mui/material';
import { styled } from '@mui/material';

export interface EdgeCardProps extends CardProps {
  /** Show the painted accent edge along the top, like edge paint on leather. */
  painted?: boolean;
  /** Show a stitch line inset from the border. Decorative only. */
  stitched?: boolean;
}

/**
 * The base surface of the system. Two optional details come straight from
 * the workshop: a painted edge in the current accent and a stitch line.
 * Both are purely decorative, so they never carry meaning on their own.
 */
export const EdgeCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'painted' && prop !== 'stitched',
})<EdgeCardProps>(({ theme, painted, stitched }) => ({
  position: 'relative',
  overflow: 'hidden',
  // The painted edge is the chapter's stripe stack, like a fore-edge.
  ...(painted && {
    borderTop: 0,
    paddingTop: `calc(${theme.spacing(2.5)} + 8px)`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 8,
      background: (() => {
        const { s1: a, s2: b, s3: c, s4: d, s5: e } = theme.vars.palette.edge.stripes;
        return `linear-gradient(90deg, ${a} 0 14%, ${b} 14% 34%, ${c} 34% 62%, ${d} 62% 78%, ${e} 78% 100%)`;
      })(),
    },
  }),
  ...(stitched && {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 7,
      borderRadius: 0,
      border: `1px dashed rgba(${theme.vars.palette.text.secondaryChannel} / 0.35)`,
      pointerEvents: 'none',
    },
  }),
}));

/**
 * A section divider: a row of dots running into a hairline, after the dotted
 * leaders in the type study. Hidden from assistive tech.
 */
export const StitchDivider = styled('hr')(({ theme }) => ({
  border: 0,
  height: 10,
  margin: theme.spacing(4, 0),
  background: `radial-gradient(circle, ${theme.vars.palette.primary.main} 3px, transparent 3.5px) 0 50% / 18px 10px repeat-x`,
  maskImage: 'linear-gradient(90deg, #000 0 40%, transparent 70%)',
  position: 'relative',
  overflow: 'visible',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '38%',
    right: 0,
    top: '50%',
    height: 1,
    background: `rgba(${theme.vars.palette.text.primaryChannel} / 0.5)`,
  },
}));
