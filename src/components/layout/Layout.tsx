import { forwardRef, type ReactNode } from 'react';
import { Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';
import rootShouldForwardProp from '@mui/material/styles/rootShouldForwardProp';
import { layout, typography, type ColumnPreset } from '../../tokens/tokens';

/**
 * Layout primitives. Screens compose these instead of writing grids, rules and
 * spacing by hand. Each one is registered with the theme under its name
 * (EdgeColumns, EdgeSection, ...), so its look can be changed in one place
 * with `theme.components.EdgeColumns.styleOverrides`. The styled ones take
 * `as` for the element (`<RuleList as="ol">`).
 */

type Responsive = number | { xs?: number; sm?: number; md?: number; lg?: number };
/** A responsive grid template: one value, or one per breakpoint. */
export type Template = string | { xs?: string; sm?: string; md?: string; lg?: string };
const BREAKS = ['xs', 'sm', 'md', 'lg'] as const;

/** Spreads a responsive value over the theme's breakpoints. */
function responsive(theme: Theme, value: Responsive | Template, css: (v: number | string) => object) {
  if (typeof value !== 'object') return css(value);
  return Object.assign({}, ...BREAKS.filter((b) => value[b] !== undefined).map((b) => (b === 'xs' ? css(value[b]!) : { [theme.breakpoints.up(b)]: css(value[b]!) })));
}

/** Forwards what MUI forwards (never `as`, `sx` or `theme`), minus this component's own props. */
const forwardExcept = (...own: string[]) => (prop: PropertyKey) => rootShouldForwardProp(prop as string) && !own.includes(prop as string);

/** Merges style objects, combining (not replacing) the same media query from each. */
function merge(...styles: (object | false | undefined)[]) {
  const out: Record<string, unknown> = {};
  for (const st of styles) {
    if (!st) continue;
    for (const [k, v] of Object.entries(st)) {
      out[k] = k.startsWith('@media') && out[k] ? { ...(out[k] as object), ...(v as object) } : v;
    }
  }
  return out;
}

// ----- Columns -------------------------------------------------------------

export interface ColumnsProps {
  /** A named column structure from the layout tokens. */
  preset?: ColumnPreset;
  /** A count of equal columns at md and up, instead of a preset (two below). */
  count?: number;
  /**
   * A one-off template, for a shape no preset has (a figure's own proportions).
   * If the same template appears twice, make it a preset instead.
   */
  template?: Template;
  /** Space between columns and rows, in theme units. */
  gap?: Responsive;
  /** Space between rows, when it differs from the space between columns. */
  rowGap?: Responsive;
  /** Rows align to their text baseline, for label-and-value rows. */
  baseline?: boolean;
  /** How items sit in their row; the default stretches them to the row's height. */
  align?: 'start' | 'center' | 'end' | 'baseline';
}

/** A responsive grid, from a named preset. Children never overflow their column. */
export const Columns = styled('div', {
  name: 'EdgeColumns', slot: 'Root',
  shouldForwardProp: forwardExcept('preset', 'count', 'template', 'gap', 'rowGap', 'baseline', 'align'),
})<ColumnsProps>(({ theme, preset = 'halves', count, template, gap = 3, rowGap, baseline, align }) => merge(
  { display: 'grid' },
  responsive(theme, template ?? (count ? { xs: 'repeat(2, 1fr)', md: `repeat(${count}, 1fr)` } : layout.columns[preset]), (v) => ({ gridTemplateColumns: v })),
  responsive(theme, gap, (v) => ({ gap: theme.spacing(v as number) })),
  rowGap !== undefined && responsive(theme, rowGap, (v) => ({ rowGap: theme.spacing(v as number) })),
  (align || baseline) && { alignItems: align ?? 'baseline' },
  { '& > *': { minWidth: 0 } },
));

// ----- Section -------------------------------------------------------------

const SectionRoot = styled('section', { name: 'EdgeSection', slot: 'Root' })(({ theme }) => ({
  ...responsive(theme, layout.sectionGap, (v) => ({ marginTop: theme.spacing(v as number) })),
}));

export interface SectionProps {
  /** The section's heading; also names the section for assistive tech. */
  title?: ReactNode;
  /** Id for the heading; required with a title so the section is labelled. */
  id?: string;
  /** Names an untitled section for assistive tech. */
  label?: string;
  /** Lead-in shown under the heading. */
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** A page section with a heading at the section level (an h2 set as h3). */
export function Section({ title, id, label, intro, children, className }: SectionProps) {
  return (
    <SectionRoot className={className} aria-labelledby={title && id ? id : undefined} aria-label={!title ? label : undefined}>
      {title && <Typography id={id} variant="h3" component="h2" sx={{ mb: intro ? 1 : 2.5 }}>{title}</Typography>}
      {intro && <Typography color="text.secondary" sx={{ mb: 3, maxWidth: typography.measure }}>{intro}</Typography>}
      {children}
    </SectionRoot>
  );
}

// ----- Rule list -----------------------------------------------------------

/**
 * A list set like a contents page: a strong rule on top, a hairline under
 * each item. Use `component` for ol, ul or dl.
 */
export const RuleList = styled('ul', { name: 'EdgeRuleList', slot: 'Root' })(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  borderTop: `1px solid ${theme.vars.palette.text.primary}`,
}));

export interface RuleItemProps {
  /** Lay the item's children out on a column preset. */
  preset?: ColumnPreset;
  /** A one-off template instead of a preset. */
  template?: Template;
  /** Vertical padding, in theme units. */
  space?: Responsive;
}

export const RuleItem = styled('li', {
  name: 'EdgeRuleItem', slot: 'Root',
  shouldForwardProp: forwardExcept('preset', 'space', 'template'),
})<RuleItemProps>(({ theme, preset, template, space = 2.5 }) => merge(
  { borderBottom: `1px solid ${theme.vars.palette.divider}` },
  responsive(theme, space, (v) => ({ paddingBlock: theme.spacing(v as number) })),
  !!(preset || template) && { display: 'grid', columnGap: theme.spacing(2), rowGap: theme.spacing(0.5), '& > *': { minWidth: 0 } },
  !!(preset || template) && responsive(theme, template ?? layout.columns[preset!], (v) => ({ gridTemplateColumns: v })),
));

// ----- Stats ---------------------------------------------------------------

export const StatGrid = styled('div', {
  name: 'EdgeStatGrid', slot: 'Root',
  shouldForwardProp: forwardExcept('count'),
})<{ count?: number }>(({ theme, count = 4 }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  [theme.breakpoints.up('md')]: { gridTemplateColumns: `repeat(${count}, 1fr)` },
  borderTop: `1px solid ${theme.vars.palette.text.primary}`,
}));

const StatRoot = styled('div', { name: 'EdgeStat', slot: 'Root' })(({ theme }) => ({
  minWidth: 0,
  paddingBlock: theme.spacing(3),
  paddingRight: theme.spacing(2),
  borderBottom: `1px solid ${theme.vars.palette.divider}`,
}));

/** One headline number and what it counts. */
export function Stat({ figure, label }: { figure: ReactNode; label: ReactNode }) {
  return (
    <StatRoot>
      <Typography variant="figure">{figure}</Typography>
      <Typography variant="body2" component="p" sx={{ mt: 1 }}>{label}</Typography>
    </StatRoot>
  );
}

// ----- Headline ------------------------------------------------------------

export interface HeadlineProps {
  bold: ReactNode;
  italic?: ReactNode;
  /** Page titles are h1; section titles are h2 and one step smaller. */
  level?: 'page' | 'section';
  id?: string;
}

const HeadlineRoot = styled('h1', { name: 'EdgeHeadline', slot: 'Root' })({ margin: 0, textWrap: 'balance' });

/** A two-voice title: heavy condensed grotesque over a Garamond italic line. */
export function Headline({ bold, italic, level = 'page', id }: HeadlineProps) {
  const page = level === 'page';
  return (
    <HeadlineRoot as={page ? 'h1' : 'h2'} id={id}>
      <Typography variant={page ? 'poster' : 'posterSection'} sx={{ display: 'block' }}>{bold}</Typography>
      {italic && <Typography variant={page ? 'posterItalic' : 'posterSectionItalic'} sx={{ display: 'block', mt: 0.5 }}>{italic}</Typography>}
    </HeadlineRoot>
  );
}

// ----- Code block ----------------------------------------------------------

const CodeRoot = styled('pre', { name: 'EdgeCodeBlock', slot: 'Root' })(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.edge.raised,
  border: `1px solid ${theme.vars.palette.divider}`,
  overflowX: 'auto',
  fontFamily: typography.mono,
  fontSize: '0.8rem',
  lineHeight: 1.6,
}));

/**
 * Code or a command, in a scrollable block. It's focusable and named, so
 * keyboard users can scroll it and screen readers announce what it is.
 */
export const CodeBlock = forwardRef<HTMLPreElement, { label: string; wrap?: boolean; children: ReactNode }>(function CodeBlock({ label, wrap, children }, ref) {
  return (
    <CodeRoot ref={ref} tabIndex={0} role="region" aria-label={label} sx={wrap ? { whiteSpace: 'pre-wrap' } : undefined}>
      <code>{children}</code>
    </CodeRoot>
  );
});

// ----- Measure -------------------------------------------------------------

/** Keeps a block of reading content to a comfortable line length. */
export const Measure = styled('div', { name: 'EdgeMeasure', slot: 'Root' })({ maxWidth: typography.measure });

// ----- Data table ----------------------------------------------------------

const TableScroll = styled('div', { name: 'EdgeDataTable', slot: 'Root' })(({ theme }) => ({
  overflowX: 'auto',
  border: `1px solid ${theme.vars.palette.divider}`,
}));

const Table = styled('table', {
  name: 'EdgeDataTable', slot: 'Table',
  shouldForwardProp: forwardExcept('dense', 'interactive', 'minWidth'),
})<{ dense?: boolean; interactive?: boolean; minWidth: number }>(({ theme, dense, interactive, minWidth }) => ({
  width: '100%',
  minWidth,
  borderCollapse: 'collapse',
  fontVariantNumeric: 'tabular-nums lining-nums',
  ...(dense && { ...theme.typography.body2 }),
  '& th, & td': {
    textAlign: 'left',
    verticalAlign: 'top',
    padding: theme.spacing(dense ? 0.9 : 1.25, dense ? 1.5 : 2),
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
    ...(dense && { whiteSpace: 'nowrap' }),
  },
  '& thead th': { ...theme.typography.caption, fontWeight: 600, color: theme.vars.palette.text.primary, backgroundColor: theme.vars.palette.edge.raised },
  '& caption': { captionSide: 'bottom', textAlign: 'left', padding: theme.spacing(1.5, 2), ...theme.typography.body2, color: theme.vars.palette.text.secondary },
  ...(interactive && {
    '& tbody tr': { cursor: 'pointer', outline: 'none' },
    '& tbody tr:hover': { backgroundColor: theme.vars.palette.action.hover },
    '& tbody tr:focus-visible': { boxShadow: `inset 3px 0 0 ${theme.vars.palette.primary.main}`, backgroundColor: theme.vars.palette.action.selected },
  }),
}));

export interface DataTableProps {
  /** Names the scrollable region for assistive tech. */
  label: string;
  /** Below this width the table scrolls sideways instead of squeezing. */
  minWidth?: number;
  /** Smaller type and padding, one line per row: for product screens. */
  dense?: boolean;
  /** Rows are clickable and focusable; they show hover and keyboard focus. */
  interactive?: boolean;
  children: ReactNode;
}

/**
 * A plain data table: raised header, hairline rows, tabular figures. It sits
 * in a focusable region so keyboard users can scroll a wide one. Write the
 * table's own caption, thead and tbody as children.
 */
export function DataTable({ label, minWidth = 720, dense, interactive, children }: DataTableProps) {
  return (
    <TableScroll tabIndex={0} role="region" aria-label={label}>
      <Table dense={dense} interactive={interactive} minWidth={minWidth}>{children}</Table>
    </TableScroll>
  );
}
