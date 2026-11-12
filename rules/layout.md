```json
{ "name": "Layout", "kind": "component", "import": "Columns, Section, RuleList, RuleItem, StatGrid, Stat, Headline, CodeBlock, DataTable, Measure, ModeScope", "summary": "Layout primitives that carry Edge's grids, section spacing, rules, stats, two-voice titles and code blocks, so screens don't write them by hand." }
```

# Layout

Screens compose these instead of writing `display: grid`, column templates, section margins, borders or type sizes in `sx`. Each styled root is registered with the theme (`EdgeColumns`, `EdgeSection`, `EdgeRuleList`, `EdgeRuleItem`, `EdgeStatGrid`, `EdgeStat`, `EdgeHeadline`, `EdgeCodeBlock`, `EdgeMeasure`), so a change to how all of them look is one `theme.components.<Name>.styleOverrides` entry, not an edit on every page.

## Rules
- Use `Columns` with a named `preset` (`halves`, `halvesEarly`, `thirds`, `quarters`, `aside`, `asideWide`, `numbered`, `narrowWide`) or `count`. Don't write `gridTemplateColumns` in a screen. If no preset fits and the shape repeats, add a preset to `layout.columns` in the tokens.
- `Section` owns the space between sections and the section heading (an `h2` set as `h3`). Give it an `id` whenever it has a `title`, so the section is labelled. An untitled section takes `label`.
- `RuleList` and `RuleItem` are for lists set like a contents page: strong rule on top, hairline under each item. Pass `as="ol"` when order matters.
- `StatGrid` and `Stat` only for figures Ben can stand behind. A figure is a number with a source, never an estimate dressed up.
- `Headline` is the page title (an `h1`) or, with `level="section"`, a large section title. One page-level `Headline` per screen.
- `CodeBlock` always gets a `label`; it's focusable so keyboard users can scroll it.
- `DataTable` for tabular data outside MUI's Table: give it a `label`, and write a `caption` and `th scope="col"` headers. `dense` for product screens, `interactive` when rows open something (then handle Enter and the arrow keys).
- `Measure` keeps reading content near 65 characters.
- `ModeScope` shows its contents in a fixed mode (ink or paper) whatever the page is in. It's for side-by-side comparisons, not for theming a whole screen.

## Text roles
Type comes from Typography variants, never from `fontSize`, `fontFamily` or `lineHeight` in `sx`: `poster`, `posterItalic`, `posterSection`, `posterSectionItalic`, `indexTitle`, `figure`, `lead`, `prose`, `eyebrow`, `kicker`, `label`, `data`, `mono`, `caption`, `brand`, `brandItalic`, plus MUI's `h1`–`h6`, `body1`, `body2`.

```tsx
<Section id="principles" title="Principles" intro="What the system holds to.">
  <Columns preset="thirds">
    <Typography variant="prose">…</Typography>
  </Columns>
</Section>
```
