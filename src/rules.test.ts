import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as edge from './index';

// Agents build from the rules files, so every component Edge exports must be
// covered by one. Adding a component without its rules fails the build.
const rulesDir = join(__dirname, '..', 'rules');
const headers = readdirSync(rulesDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const m = readFileSync(join(rulesDir, f), 'utf8').match(/^```json\n([\s\S]*?)\n```/);
    return { file: f, header: m ? (JSON.parse(m[1]) as { name: string; summary: string; import?: string }) : null };
  });

const covered = new Set(headers.flatMap((h) => (h.header?.import ?? '').split(',').map((s) => s.trim())));

// React components are the exports whose names start with a capital letter
// and that are functions or styled components (objects with a render).
const components = Object.entries(edge)
  .filter(([name, v]) => /^[A-Z]/.test(name) && (typeof v === 'function' || (typeof v === 'object' && v !== null && 'render' in v)))
  .map(([name]) => name)
  .filter((name) => !['EdgeThemeProvider'].includes(name));

describe('rules files', () => {
  it('each has a JSON header with a name and summary', () => {
    for (const h of headers) {
      expect(h.header, h.file).not.toBeNull();
      expect(h.header!.name, h.file).toBeTruthy();
      expect(h.header!.summary.length, h.file).toBeGreaterThan(20);
    }
  });

  it.each(components)('%s is covered by a rules file', (name) => {
    expect(covered.has(name)).toBe(true);
  });
});
