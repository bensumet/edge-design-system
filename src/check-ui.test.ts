import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(__dirname, '..', 'scripts', 'check-ui.mjs');
const dir = mkdtempSync(join(tmpdir(), 'check-ui-'));

/** Runs the checker on one screen's source and returns the ids of the rules it broke. */
function check(src: string): string[] {
  const file = join(dir, `s${Math.random().toString(36).slice(2)}.tsx`);
  writeFileSync(file, `import { Columns } from '@bensumet/edge';\n${src}`);
  const [result] = JSON.parse(execFileSync('node', [script, file], { encoding: 'utf8' }));
  return result.failed.map((f: { id: string }) => f.id);
}

describe('check-ui', () => {
  it('flags type set by hand', () => {
    expect(check(`<Typography sx={{ fontSize: '1.1rem' }} />`)).toContain('type-roles');
    expect(check(`<Typography sx={{ fontFamily: typography.display }} />`)).toContain('type-roles');
    expect(check(`<Typography variant="prose" />`)).not.toContain('type-roles');
  });

  it('flags hand-written grids', () => {
    expect(check(`<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} />`)).toContain('layout-presets');
    expect(check(`<Columns preset="halves" />`)).not.toContain('layout-presets');
  });

  it('flags colors read outside the CSS variables', () => {
    expect(check(`const c = (t) => alpha(t.palette.primary.main, 0.2);`)).toContain('theme-vars');
    expect(check(`const c = (t) => t.vars.palette.primary.main;`)).not.toContain('theme-vars');
  });

  it('accepts a channel color built from a variable, but not a literal rgba()', () => {
    expect(check('const c = `rgba(${vars.palette.primary.mainChannel} / 0.1)`;')).not.toContain('theme-colors');
    expect(check(`const c = 'rgba(0, 0, 0, 0.1)';`)).toContain('theme-colors');
  });

  it('honours a written exception', () => {
    expect(check(`// edge-allow type-roles: a specimen\n<Box sx={{ fontSize: '9rem' }} />`)).not.toContain('type-roles');
  });
});
