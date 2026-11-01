import { Box, Typography, type TypographyProps } from '@mui/material';
import { typography } from '../../tokens/tokens';

/**
 * An opening paragraph set like the first lines of a book chapter: Garamond
 * at reading size, generous leading, and the first few words in true small
 * caps. The small caps come from the font's own glyphs (font-variant-caps),
 * not from shrunken capitals.
 */
export function Lead({ opening, children, sx, ...rest }: { opening: string; children: React.ReactNode } & TypographyProps) {
  return (
    <Typography
      component="p"
      sx={{
        fontFamily: typography.display,
        fontSize: { xs: '1.2rem', md: '1.32rem' },
        lineHeight: typography.readingLeading,
        maxWidth: typography.measure,
        color: 'text.primary',
        hangingPunctuation: 'first',
        ...sx,
      }}
      {...rest}
    >
      <Box component="span" sx={{ fontVariantCaps: 'all-small-caps', letterSpacing: '0.06em', fontWeight: 500, color: 'primary.main' }}>
        {opening}
      </Box>{' '}
      {children}
    </Typography>
  );
}
