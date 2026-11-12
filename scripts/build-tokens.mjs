#!/usr/bin/env node
// Publishes Edge for machines: tokens as W3C Design Tokens (DTCG) JSON and CSS
// custom properties, the component rules, a rules index, and llms.txt.
//
// src/tokens/tokens.ts stays the single source of truth; everything here is
// generated from it, so the data an agent reads can't drift from the code.
//
// Usage: node scripts/build-tokens.mjs [outDir] [siteRoot]   (after the library build, which writes dist/tokens.js)
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] ?? join(root, 'dist');
const t = await import(join(root, 'dist/tokens.js'));
const { contrastRatio } = t;

const color = (value, description) => ({ $type: 'color', $value: value, ...(description && { $description: description }) });
const surfaceNotes = {
  background: 'Page background.',
  surface: 'Cards and the app bar.',
  raised: 'Menus, dialogs and hover fills.',
  border: 'Dividers and decorative outlines. Not for control boundaries.',
  control: 'Input outlines. At least 3:1 against surface (WCAG 1.4.11).',
  text: 'Primary text. At least 4.5:1 on every surface.',
  muted: 'Secondary text. At least 4.5:1 on every surface.',
};

const modes = Object.keys(t.surfaces);
const accents = Object.keys(t.edges);

const tokens = {
  $description: 'Edge design tokens. Generated from src/tokens/tokens.ts; do not edit by hand.',
  color: {
    surface: Object.fromEntries(modes.map((m) => [m, Object.fromEntries(Object.entries(t.surfaces[m]).map(([k, v]) => [k, color(v, surfaceNotes[k])]))])),
    accent: Object.fromEntries(accents.map((name) => {
      const e = t.edges[name];
      return [name, {
        ink: color(e.ink, `${e.label} on ink (dark) surfaces. Text, focus rings and fills.`),
        'on-ink': color(e.onInk, 'Text on an ink-mode accent fill.'),
        paper: color(e.paper, `${e.paperLabel} on paper (light) surfaces.`),
        'on-paper': color(e.onPaper, 'Text on a paper-mode accent fill.'),
      }];
    })),
    status: Object.fromEntries(modes.map((m) => [m, Object.fromEntries(Object.entries(t.status[m]).map(([k, v]) => [k, color(v)]))])),
    stripes: Object.fromEntries(accents.map((name) => [name, {
      ink: { $type: 'color', $value: [...t.chapters[name].stripes], $description: 'Decorative only. Never carries text or meaning.' },
      paper: { $type: 'color', $value: [...t.chapters[name].paperStripes], $description: 'Decorative only. Never carries text or meaning.' },
    }])),
  },
  font: {
    family: {
      poster: { $type: 'fontFamily', $value: t.typography.poster, $description: 'Headlines only: heavy, condensed, uppercase.' },
      display: { $type: 'fontFamily', $value: t.typography.display, $description: 'Reading text, italic counterpoint, small caps.' },
      body: { $type: 'fontFamily', $value: t.typography.body, $description: 'Interface labels and numbers.' },
      mono: { $type: 'fontFamily', $value: t.typography.mono, $description: 'Code, file names and token names. System faces only.' },
    },
    size: Object.fromEntries(Object.entries(t.typography.scale).map(([k, v]) => [k, { $type: 'dimension', $value: `${v}px` }])),
    measure: { $type: 'dimension', $value: t.typography.measure, $description: 'Maximum line length for reading text.' },
    leading: { reading: { $type: 'number', $value: t.typography.readingLeading } },
    // Text roles: every piece of text on a screen is one of these. In React,
    // each is a Typography variant; in CSS, a .edge-<role> class.
    role: Object.fromEntries(Object.entries(t.textRoles).map(([name, r]) => [name, {
      $type: 'typography',
      $description: r.description,
      $value: {
        fontFamily: `{font.family.${r.family}}`,
        fontSize: r.size,
        lineHeight: r.leading,
        ...(r.weight && { fontWeight: r.weight }),
        ...(r.stretch && { fontStretch: `${r.stretch}%` }),
        ...(r.tracking && { letterSpacing: r.tracking }),
        ...(r.italic && { fontStyle: 'italic' }),
        ...(r.caps !== undefined && { textTransform: r.caps ? 'uppercase' : 'none' }),
      },
    }])),
  },
  layout: {
    columns: Object.fromEntries(Object.entries(t.layout.columns).map(([name, v]) => [name, { $type: 'gridTemplate', $value: v, $description: 'Responsive grid-template-columns by breakpoint (sm 600px, md 900px).' }])),
    sectionGap: { $type: 'number', $value: t.layout.sectionGap, $description: 'Space between page sections, in 8px theme units, by breakpoint.' },
  },
  space: Object.fromEntries(t.space.map((v, i) => [String(i), { $type: 'dimension', $value: `${v}px` }])),
  motion: {
    duration: Object.fromEntries(Object.entries(t.motion.duration).map(([k, v]) => [k, { $type: 'duration', $value: `${v}ms` }])),
    ease: Object.fromEntries(Object.entries(t.motion.ease).map(([k, v]) => [k, { $type: 'cubicBezier', $value: v.match(/[\d.]+/g).map(Number) }])),
    rise: { $type: 'dimension', $value: `${t.motion.rise}px` },
  },
  radius: Object.fromEntries(Object.entries(t.radius).map(([k, v]) => [k, { $type: 'dimension', $value: `${v}px`, $description: 'Square corners throughout.' }])),
};

// CSS custom properties, one block per mode and accent combination's essentials.
const css = [];
css.push('/* Edge tokens as CSS custom properties. Generated from src/tokens/tokens.ts. */');
for (const m of modes) {
  const sel = m === 'ink' ? ':root[data-edge-mode="ink"]' : ':root, :root[data-edge-mode="paper"]';
  css.push(`${sel} {`);
  for (const [k, v] of Object.entries(t.surfaces[m])) css.push(`  --edge-${k}: ${v};`);
  for (const [k, v] of Object.entries(t.status[m])) css.push(`  --edge-${k}: ${v};`);
  css.push('}');
  for (const a of accents) {
    const ac = t.accent(a, m);
    css.push(`${m === 'paper' ? `:root[data-edge-accent="${a}"], :root[data-edge-mode="paper"][data-edge-accent="${a}"]` : `:root[data-edge-mode="ink"][data-edge-accent="${a}"]`} { --edge-accent: ${ac.main}; --edge-on-accent: ${ac.on}; }`);
  }
}
css.push(':root {');
css.push(`  --edge-font-poster: ${t.typography.poster};`);
css.push(`  --edge-font-display: ${t.typography.display};`);
css.push(`  --edge-font-body: ${t.typography.body};`);
css.push(`  --edge-font-mono: ${t.typography.mono};`);
css.push(`  --edge-measure: ${t.typography.measure};`);
t.space.forEach((v, i) => css.push(`  --edge-space-${i}: ${v}px;`));
Object.entries(t.motion.duration).forEach(([k, v]) => css.push(`  --edge-motion-${k}: ${v}ms;`));
css.push(`  --edge-ease-enter: ${t.motion.ease.enter};`);
css.push('}');
// Text roles as classes, so a page outside React sets type the same way.
const family = { display: 'var(--edge-font-display)', poster: 'var(--edge-font-poster)', body: 'var(--edge-font-body)', mono: 'var(--edge-font-mono)' };
for (const [name, r] of Object.entries(t.textRoles)) {
  const size = typeof r.size === 'string' ? r.size : r.size.xs;
  const decl = [`font-family: ${family[r.family]}`, `font-size: ${size}`, `line-height: ${r.leading}`];
  if (r.weight) decl.push(`font-weight: ${r.weight}`);
  if (r.stretch) decl.push(`font-stretch: ${r.stretch}%`);
  if (r.tracking) decl.push(`letter-spacing: ${r.tracking}`);
  if (r.italic) decl.push('font-style: italic');
  if (r.caps !== undefined) decl.push(`text-transform: ${r.caps ? 'uppercase' : 'none'}`);
  if (r.smallCaps) decl.push('font-variant-caps: all-small-caps');
  if (r.tabular) decl.push('font-variant-numeric: tabular-nums lining-nums');
  css.push(`.edge-${name} { ${decl.join('; ')}; }`);
  if (typeof r.size !== 'string') css.push(`@media (min-width: 900px) { .edge-${name} { font-size: ${r.size.md}; } }`);
}

// Contrast report: the pairs the UI relies on, measured, as agents can't eyeball.
const pairs = [];
for (const m of modes) {
  const s = t.surfaces[m];
  for (const surf of ['background', 'surface', 'raised']) {
    pairs.push({ mode: m, fg: 'text', bg: surf, ratio: contrastRatio(s.text, s[surf]), needs: 4.5 });
    pairs.push({ mode: m, fg: 'muted', bg: surf, ratio: contrastRatio(s.muted, s[surf]), needs: 4.5 });
  }
  pairs.push({ mode: m, fg: 'control', bg: 'surface', ratio: contrastRatio(s.control, s.surface), needs: 3 });
  for (const a of accents) {
    const ac = t.accent(a, m);
    pairs.push({ mode: m, fg: `accent.${a}`, bg: 'background', ratio: contrastRatio(ac.main, s.background), needs: 4.5 });
    pairs.push({ mode: m, fg: `on-accent.${a}`, bg: `accent.${a}`, ratio: contrastRatio(ac.on, ac.main), needs: 4.5 });
  }
}
const contrast = pairs.map((p) => ({ ...p, ratio: Math.round(p.ratio * 100) / 100, passes: p.ratio >= p.needs }));

// Rules: one markdown file per component, with a small JSON header.
const rulesDir = join(root, 'rules');
const rules = readdirSync(rulesDir).filter((f) => f.endsWith('.md')).sort().map((file) => {
  const text = readFileSync(join(rulesDir, file), 'utf8');
  const m = text.match(/^```json\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`${file} needs a JSON header`);
  return { file, ...JSON.parse(m[1]), text };
});

mkdirSync(join(out, 'rules'), { recursive: true });
writeFileSync(join(out, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
writeFileSync(join(out, 'tokens.css'), css.join('\n') + '\n');
writeFileSync(join(out, 'contrast.json'), JSON.stringify(contrast, null, 2) + '\n');
for (const r of rules) writeFileSync(join(out, 'rules', r.file), r.text);
writeFileSync(join(out, 'rules', 'index.json'), JSON.stringify(rules.map(({ text, ...meta }) => ({ ...meta, url: `rules/${meta.file}` })), null, 2) + '\n');

const llms = [
  '# Edge design system',
  '',
  '> Edge is a small, accessible React + MUI design system by Ben Viwatmanitsakul. Build with it by reading the rules below before writing UI: components read every color from the theme, so never hard-code colors, and every text pair must meet WCAG AA. Type comes from text roles (`<Typography variant="prose">`) and grids from layout presets (`<Columns preset="halves">`); a screen never sets font, size, leading or grid columns itself.',
  '',
  'Install: the `@bensumet/edge` workspace package. Wrap the app in `<EdgeThemeProvider>`; import components from `@bensumet/edge`.',
  '',
  '## Tokens',
  '',
  '- [tokens.json](tokens.json): W3C Design Tokens format: surfaces, accents, status colors, type and text roles, layout presets, spacing',
  '- [tokens.css](tokens.css): the same tokens as CSS custom properties, and each text role as an `.edge-<role>` class, for non-React pages',
  '- [contrast.json](contrast.json): every color pair the UI relies on, with its measured contrast ratio',
  '',
  '## Rules',
  '',
  ...rules.map((r) => `- [${r.name}](rules/${r.file}): ${r.summary}`),
  '',
  '## MCP server',
  '',
  '- Install `@bensumet/edge`, then run `npx edge-mcp` (stdio). Tools: `get_tokens`, `get_component_guidance`, `check_contrast`.',
  '',
  '## Optional',
  '',
  '- [Source](https://github.com/bensumet/edge-design-system): the package source, with tests that fail the build when a token change breaks contrast',
  '',
].join('\n');
writeFileSync(join(out, 'llms.txt'), llms);
// Optional site root: a copy of the index at /llms.txt, with links pointing into the data folder.
const siteRoot = process.argv[3];
if (siteRoot) {
  const prefix = out.replace(/\/+$/, '').split('/').pop() + '/';
  writeFileSync(join(siteRoot, 'llms.txt'), llms.replace(/\]\((?!https?:)([^)]+)\)/g, `](${prefix}$1)`));
}

const failing = contrast.filter((p) => !p.passes);
console.log(`Edge: ${Object.keys(tokens.color.accent).length} accents, ${rules.length} rules, ${contrast.length} contrast pairs (${failing.length} failing) -> ${out}`);
if (failing.length) process.exit(1);
