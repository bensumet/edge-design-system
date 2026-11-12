#!/usr/bin/env node
// Checks a screen's source against Edge's rules. Static checks only: they read
// the code, so they catch what's written down (a hex color, a missing label),
// not how the screen looks. Pair with type checks and an accessibility render.
//
// Usage: npx edge-check-ui [--ai] file.tsx [...]   (or node scripts/check-ui.mjs from this repo)
//   --ai  the screen shows AI output, so the AI-pattern rules apply
// Prints JSON: one result per file.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const ai = args.includes('--ai');
const files = args.filter((a) => !a.startsWith('--'));

// Drop comments so explanations don't count as code.
// Untagged template literals (code samples, messages) are content, not styles;
// tagged ones like styled.div`...` are still checked.
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
  .replace(/([=(,:?]\s*|return\s+)`([^`]*)`/g, (_, pre, body) => `${pre}\`${body.replace(/[^\n]/g, ' ')}\``);
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
const all = (re, src) => [...src.matchAll(re)].map((m) => lineOf(src, m.index));
/** JSX opening tags of a component, including multi-line props. */
// "=>" inside a prop (an arrow function) is not the end of the tag.
const tags = (name, src) => [...src.matchAll(new RegExp(`<(?:${name})\\b((?:=>|[^>])*?\\/?)>`, 'g'))].map((m) => ({ props: m[1], line: lineOf(src, m.index) }));
/** A dialog is its own view, so its buttons don't count against the page's. */
const withoutDialogs = (s) => s.replace(/<Dialog\b[\s\S]*?<\/Dialog>/g, (m) => m.replace(/[^\n]/g, ' '));

const rules = [
  {
    id: 'theme-colors', rule: 'Colors come from the theme, never hex, rgb() or hsl() values',
    find: (s) => [...all(/['"`]#[0-9a-fA-F]{3,8}['"`\s;)]/g, s), ...all(/\b(rgba?|hsla?)\((?!\$\{)/g, s)],
  },
  { id: 'square-corners', rule: 'Corners are square: no borderRadius', find: (s) => all(/borderRadius\s*[:=]\s*(?!\s*['"]?0\b)/g, s) },
  {
    // A screen picks a text role (<Typography variant="prose">); the theme owns
    // family, size, leading, tracking and width. A literal here drifts from the
    // scale and doesn't follow a change to the system.
    id: 'type-roles', rule: 'Type comes from text roles (Typography variant), not font, size or leading set by hand',
    find: (s) => all(/\b(fontFamily|fontSize|lineHeight|letterSpacing|fontStretch)\s*:/g, s),
  },
  {
    // Grids come from Columns presets. A one-off shape (a figure's own
    // proportions) goes in Columns' template prop, where it's visible as one.
    id: 'layout-presets', rule: 'Grids come from Edge layout (Columns presets), not gridTemplateColumns',
    find: (s) => all(/\bgridTemplateColumns\s*:/g, s),
  },
  {
    // theme.vars follows the mode attribute; theme.palette is fixed to one
    // scheme, and alpha() bakes a color in at build time.
    id: 'theme-vars', rule: 'Colors are read through theme.vars, not theme.palette or alpha()',
    find: (s) => [...all(/\balpha\(/g, s), ...all(/(?<!vars)\.palette\.(?!mode\b)/g, s)],
  },
  {
    id: 'visible-labels', rule: 'Every input has a visible label',
    find: (s) => [
      ...tags('TextField', s).filter((t) => !/\blabel\s*=/.test(t.props)).map((t) => t.line),
      ...tags('Select', s).filter((t) => !/\b(labelId|label|aria-label|aria-labelledby)\s*=/.test(t.props)).map((t) => t.line),
      ...tags('input', s).filter((t) => !/\b(aria-label|aria-labelledby|id)\s*=/.test(t.props)).map((t) => t.line),
    ],
  },
  {
    id: 'one-primary', rule: 'One filled button per view',
    find: (s) => { const l = all(/variant\s*=\s*["']contained["']/g, withoutDialogs(s)); return l.length > 1 ? l.slice(1) : []; },
  },
  {
    id: 'no-decoration-in-data', rule: 'No decorative pieces inside data views',
    find: (s) => (/<(Table|table|DataGrid)\b/.test(s) ? all(/<(ChapterStripes|WallArt|GhostWord|DotRule|OutlineEcho)\b/g, s) : []),
  },
  {
    // Spacing comes from the 4px scale: theme units (p: 2) or the space tokens, not pixel strings.
    id: 'scale-spacing', rule: 'Spacing comes from the scale, not raw pixel values',
    find: (s) => all(/\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|rowGap|columnGap|padding\w*|margin\w*)\s*:\s*['"`](?![^'"`]*env\()[^'"`]*\b\d+px\b/g, s),
  },
  {
    // A colored dot or bar with no words is status by color alone. Pair it with a word,
    // or name it for assistive tech and put the word beside it.
    id: 'status-not-color-only', rule: 'Status is never shown by color alone',
    find: (s) => tags('Box|span|div', s)
      .filter((t) => /\b(bgcolor|backgroundColor|color)\s*:\s*['"`](success|warning|error|info)\.(main|light|dark)/.test(t.props) && /\/$/.test(t.props.trim()) && !/aria-label|title\s*=/.test(t.props))
      .map((t) => t.line),
  },
  { id: 'no-page-landmarks', rule: 'Screens don\u2019t declare page landmarks (main belongs to the app shell)', find: (s) => all(/<main\b|component\s*=\s*["']main["']|role\s*=\s*["']main["']/g, s) },
  { id: 'edge-first', rule: 'Uses Edge (@bensumet/edge)', find: (s) => (/from\s+['"]@bensumet\/edge['"]/.test(s) ? [] : [1]) },
  { id: 'no-other-ui-kits', rule: 'No other UI libraries', find: (s) => all(/from\s+['"](antd|@chakra-ui\/[^'"]+|styled-components|bootstrap|react-bootstrap|@headlessui\/react)['"]/g, s) },
];

const aiRules = [
  { id: 'ai-labeled', rule: 'AI output is labeled (AiLabel or SummaryCard)', find: (s) => (/<(AiLabel|SummaryCard)\b/.test(s) ? [] : [1]) },
  { id: 'ai-feedback', rule: 'AI output has feedback (FeedbackBar or SummaryCard)', find: (s) => (/<(FeedbackBar|SummaryCard)\b/.test(s) ? [] : [1]) },
  { id: 'ai-sources', rule: 'Summaries cite sources (SummaryCard)', find: (s) => (/<SummaryCard\b/.test(s) || /\bsources?\b/i.test(s) ? [] : [1]) },
];

// States beyond the happy path: look for the words a person would see.
const states = [
  { id: 'loading', test: (s) => /\b(loading|Skeleton|CircularProgress|LinearProgress)\b/i.test(s) },
  { id: 'empty', test: (s) => /\b(no [a-z]+ (yet|found|match)|nothing (here|to show|matches)|empty)\b/i.test(s) },
  { id: 'error', test: (s) => /\b(try again|retry|couldn['’]t|could not|something went wrong)\b/i.test(s) },
];

// Deliberate exceptions are written down, with a reason, where they happen:
//   // edge-allow rule-id: reason            (this line and the next)
//   // edge-allow-file rule-id: reason       (the whole file)
// They're reported, so an exception is visible rather than silent.
function exceptions(raw) {
  const byLine = [];
  const file = [];
  raw.split('\n').forEach((line, i) => {
    const m = line.match(/edge-allow(-file)?\s+([a-z-]+):\s*(.+?)(\s*\*\/)?\s*\}?\s*$/);
    if (!m) return;
    if (m[1]) file.push({ id: m[2], reason: m[3] });
    else byLine.push({ id: m[2], reason: m[3], lines: [i + 1, i + 2] });
  });
  return { byLine, file };
}

const out = files.map((file) => {
  const raw = readFileSync(file, 'utf8');
  const src = strip(raw);
  const ex = exceptions(raw);
  const allowed = [];
  const checks = [...rules, ...(ai ? aiRules : [])].map((r) => {
    const lines = r.find(src).filter((n) => {
      const hit = ex.file.find((e) => e.id === r.id) ?? ex.byLine.find((e) => e.id === r.id && e.lines.includes(n));
      if (hit && !allowed.some((a) => a.id === r.id && a.reason === hit.reason)) allowed.push({ id: r.id, reason: hit.reason });
      return !hit;
    });
    return { id: r.id, rule: r.rule, lines };
  });
  const failed = checks.filter((c) => c.lines.length);
  return {
    ...(allowed.length && { allowed }),
    file,
    passed: checks.length - failed.length,
    total: checks.length,
    violations: failed.reduce((n, c) => n + c.lines.length, 0),
    failed: failed.map((c) => ({ id: c.id, rule: c.rule, count: c.lines.length, lines: c.lines })),
    states: Object.fromEntries(states.map((st) => [st.id, st.test(src)])),
  };
});
console.log(JSON.stringify(out, null, 2));
