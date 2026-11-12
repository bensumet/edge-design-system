#!/usr/bin/env node
// Edge MCP server: lets a coding assistant ask Edge directly for its tokens,
// the guidance for a component, and a contrast check, instead of guessing.
//
// It reads the package's compiled tokens and its rules files, the same
// sources the components and the tests use, so the answers can't drift.
//
// Run:  npx edge-mcp   (or: node mcp/server.mjs, after npm run build)
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = await import(join(root, 'dist/tokens.js'));
const { contrastRatio, wcagLevel } = t;

const MODES = Object.keys(t.surfaces);
const ACCENTS = Object.keys(t.edges);

// Rules files: a JSON header, then markdown.
const rules = readdirSync(join(root, 'rules')).filter((f) => f.endsWith('.md')).sort().map((file) => {
  const text = readFileSync(join(root, 'rules', file), 'utf8');
  const meta = JSON.parse(text.match(/^```json\n([\s\S]*?)\n```/)[1]);
  return { file, ...meta, body: text.replace(/^```json\n[\s\S]*?\n```\n+/, '') };
});
const foundations = rules.find((r) => r.kind === 'global');
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });

function tokensFor(mode, accent) {
  const s = t.surfacesFor(mode, accent);
  return {
    mode,
    accent: { name: accent, label: t.edgeLabel(accent, mode), color: t.edgeColor(accent, mode) },
    surfaces: s,
    status: t.status[mode] ?? t.status,
    typography: t.typography,
    space: t.space,
    radius: t.radius,
    use: 'In React, read these through the MUI theme (primary.main, text.secondary, background.paper, edge.*), never as literal values.',
  };
}

// Accepts a hex value or a token path such as "ink.text" or "paper.surface".
function resolveColor(value) {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return { value, from: 'hex' };
  const [mode, key] = value.split('.');
  const s = t.surfaces[mode];
  if (s && key in s) return { value: s[key], from: value };
  if (mode in t.edges && MODES.includes(key)) return { value: t.edgeColor(mode, key), from: `${mode} accent in ${key}` };
  throw new Error(`Unknown color "${value}". Use a hex value, a surface token like "ink.text", or an accent like "orange.paper".`);
}

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const server = new McpServer({ name: 'edge', version });

server.registerTool('get_tokens', {
  title: 'Get Edge tokens',
  description: 'Returns Edge\'s color, type, spacing and radius tokens for a mode (ink is dark, paper is light) and accent. Call this before choosing any color or spacing.',
  inputSchema: {
    mode: z.enum(MODES).optional().describe('ink (dark) or paper (light). Omit for both.'),
    accent: z.enum(ACCENTS).optional().describe('Accent name. Defaults to orange.'),
  },
}, async ({ mode, accent = 'orange' }) => text(mode ? tokensFor(mode, accent) : MODES.map((m) => tokensFor(m, accent))));

server.registerTool('get_component_guidance', {
  title: 'Get component guidance',
  description: 'Returns the rules for an Edge component: when to use it, when not to, its props and its accessibility requirements, plus the foundations every screen follows. Omit the component to list them all.',
  inputSchema: {
    component: z.string().optional().describe('Component or rules name, for example "SummaryCard", "AiLabel" or "Buttons".'),
  },
}, async ({ component }) => {
  const index = rules.map((r) => `- ${r.name} (${r.kind}): ${r.summary}`).join('\n');
  if (!component) return text(`Edge rules:\n${index}`);
  const q = norm(component);
  const hit = rules.find((r) => norm(r.name) === q || norm(r.file.replace('.md', '')) === q)
    ?? rules.find((r) => norm(r.name).includes(q) || norm(r.file).includes(q) || norm(r.body).includes(`<${q}`));
  if (!hit) return { ...text(`No rules found for "${component}". Use one of these, or build from MUI primitives inside the theme:\n${index}`), isError: true };
  const parts = [hit.body];
  if (hit !== foundations) parts.push('---\nFoundations (apply to every screen):\n\n' + foundations.body);
  return text(parts.join('\n\n'));
});

server.registerTool('check_contrast', {
  title: 'Check contrast',
  description: 'Measures the WCAG contrast ratio between two colors and says whether it passes for the use you give. Colors can be hex values or Edge tokens like "ink.text", "paper.surface" or "orange.paper".',
  inputSchema: {
    foreground: z.string(),
    background: z.string(),
    use: z.enum(['text', 'large-text', 'control']).default('text').describe('text needs 4.5:1; large text and control outlines need 3:1.'),
  },
}, async ({ foreground, background, use }) => {
  try {
    const fg = resolveColor(foreground);
    const bg = resolveColor(background);
    const ratio = Math.round(contrastRatio(fg.value, bg.value) * 100) / 100;
    const needs = use === 'text' ? 4.5 : 3;
    return text({ foreground: fg, background: bg, ratio, needs, passes: ratio >= needs, level: wcagLevel(ratio) });
  } catch (e) {
    return { ...text(e.message), isError: true };
  }
});

await server.connect(new StdioServerTransport());
