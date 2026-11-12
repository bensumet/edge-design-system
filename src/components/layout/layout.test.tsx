import { render } from '@testing-library/react';
import { EdgeThemeProvider } from '../../theme/EdgeThemeProvider';
import { Columns, DataTable, RuleItem, RuleList } from './Layout';

const wrap = (ui: React.ReactElement) => render(<EdgeThemeProvider>{ui}</EdgeThemeProvider>);

/** All the CSS emotion has written so far, as one string. */
const css = () => [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n')
  + [...document.styleSheets].flatMap((sh) => { try { return [...sh.cssRules].map((r) => r.cssText); } catch { return []; } }).join('\n');

describe('layout primitives', () => {
  it('render the element asked for, and never pass styling props to the DOM', () => {
    const { container } = wrap(
      <Columns as="dl" preset="aside" gap={2} sx={{ mt: 1 }} data-testid="cols">
        <dt>Term</dt><dd>Definition</dd>
      </Columns>,
    );
    const el = container.querySelector('[data-testid="cols"]')!;
    expect(el.tagName).toBe('DL');
    for (const attr of ['as', 'sx', 'preset', 'gap']) expect(el.hasAttribute(attr)).toBe(false);
  });

  it('keep a responsive template and a responsive gap in the same media query', () => {
    wrap(<Columns template={{ xs: '1fr', md: '3fr 1fr' }} gap={{ xs: 1, md: 4 }}><div /><div /></Columns>);
    // Both values must survive: an object spread used to let the gap's media
    // query replace the template's, so the grid lost its desktop columns.
    const rule = css().match(/@media \(min-width: ?900px\)\s*\{[^}]*3fr 1fr[^}]*\}/);
    expect(rule?.[0]).toMatch(/gap/);
  });

  it('RuleList and RuleItem take list elements', () => {
    const { container } = wrap(<RuleList as="ol"><RuleItem preset="numbered">One</RuleItem></RuleList>);
    expect(container.querySelector('ol > li')).not.toBeNull();
  });

  it('DataTable is a named, focusable region around a table', () => {
    const { getByRole } = wrap(<DataTable label="Results"><tbody><tr><td>1</td></tr></tbody></DataTable>);
    const region = getByRole('region', { name: 'Results' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region.querySelector('table')).not.toBeNull();
  });
});
