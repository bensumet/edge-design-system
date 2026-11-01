import { contrastRatio } from './contrast';
import { accent, chapters, edges, status, surfaces, surfacesFor, type EdgeName, type Mode } from './tokens';

// WCAG 2.1: 4.5:1 for normal text (1.4.3), 3:1 for UI component boundaries (1.4.11).
const TEXT = 4.5;
const UI = 3;

const modes: Mode[] = ['ink', 'paper'];
const edgeNames = Object.keys(edges) as EdgeName[];

describe('contrast math', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });
});

describe.each(modes)('%s mode', (mode) => {
  const s = surfaces[mode];
  const backgrounds = { background: s.background, surface: s.surface, raised: s.raised };

  it.each(Object.entries(backgrounds))('text passes AA on %s', (_, bg) => {
    expect(contrastRatio(s.text, bg)).toBeGreaterThanOrEqual(TEXT);
    expect(contrastRatio(s.muted, bg)).toBeGreaterThanOrEqual(TEXT);
  });

  it('input outlines meet the 3:1 non-text minimum', () => {
    expect(contrastRatio(s.control, s.surface)).toBeGreaterThanOrEqual(UI);
    expect(contrastRatio(s.control, s.background)).toBeGreaterThanOrEqual(UI);
  });

  it.each(edgeNames)('%s edge works as text and as a button fill', (name) => {
    const { main, on } = accent(name, mode);
    for (const bg of Object.values(backgrounds)) {
      expect(contrastRatio(main, bg)).toBeGreaterThanOrEqual(TEXT);
    }
    expect(contrastRatio(on, main)).toBeGreaterThanOrEqual(TEXT);
  });

  it('status colors pass AA on surfaces', () => {
    for (const c of Object.values(status[mode])) {
      expect(contrastRatio(c, s.surface)).toBeGreaterThanOrEqual(TEXT);
      expect(contrastRatio(c, s.background)).toBeGreaterThanOrEqual(TEXT);
    }
  });
});

describe.each(Object.keys(chapters) as EdgeName[])('%s chapter on paper', (name) => {
  const s = surfacesFor('paper', name);
  const c = chapters[name];
  const deep = edges[name].paper;

  it('text, secondary text and the accent pass AA on the wash and the tint', () => {
    for (const bg of [c.wash, c.tint]) {
      expect(contrastRatio(s.text, bg)).toBeGreaterThanOrEqual(TEXT);
      expect(contrastRatio(s.muted, bg)).toBeGreaterThanOrEqual(TEXT);
      expect(contrastRatio(deep, bg)).toBeGreaterThanOrEqual(TEXT);
    }
  });

  it('input outlines meet 3:1 on the wash', () => {
    expect(contrastRatio(s.control, c.wash)).toBeGreaterThanOrEqual(UI);
  });

  it('status colors pass AA on the wash', () => {
    for (const col of Object.values(status.paper)) {
      expect(contrastRatio(col, c.wash)).toBeGreaterThanOrEqual(TEXT);
    }
  });
});
