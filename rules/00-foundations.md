```json
{ "name": "Foundations", "kind": "global", "summary": "Rules every screen follows: color from the theme's variables, AA contrast, type from text roles, grids from layout presets, square corners, one primary action." }
```

# Foundations

These apply to every screen built with Edge. Read them first.

## Color
- Read every color from the theme (`primary.main`, `text.secondary`, `background.paper`, `edge.*`). Never hard-code a hex, `rgb()` or `hsl()` value in a component.
- Both modes are CSS variables (`--edge-palette-*`) switched by the `data-edge-mode` attribute, so the page never re-renders to change mode. In a styled component or a theme callback, read `theme.vars.palette.*`, never `theme.palette.*` (fixed to one mode) or `alpha()` (baked in at build time). For a translucent color, use the channel: `rgba(${theme.vars.palette.primary.mainChannel} / 0.2)`.
- To show both modes side by side, wrap each in `ModeScope`.
- One accent per screen. The accent marks focus, selection and the single primary action. Everything else is neutral.
- Status colors (`success`, `warning`, `error`, `info`) are for status only, never decoration.
- Never use color as the only signal. Pair it with a word, an icon shape, or position.
- Contrast: text and secondary text 4.5:1 on every surface; control outlines 3:1 against their surface. `contrast.json` lists the measured pairs.

## Type
- Three voices. **Poster** (Archivo, condensed, heavy, uppercase) for page and section headlines only. **Display** (EB Garamond) for reading text, italic counterpoints and small caps. **Body** (Inter) for interface labels, buttons and numbers.
- Pair a heavy poster line with a Garamond italic line for openers; don't stack two poster lines of the same weight.
- Reading text: hold lines to about 66 characters (`measure`) with 1.65 leading.
- Numbers in columns use tabular figures.
- **Every piece of text is a text role.** Pick one with `<Typography variant="…">`: `prose` for reading text, `lead` for an opening paragraph, `label` for the bold head of a point, `eyebrow` for a running head, `data` and `metric` for numbers, `mono` for code, `caption` for small print, and the poster roles for titles. The full list, with what each is for, is in `tokens.json` under `font.role`.
- A screen never sets `fontFamily`, `fontSize`, `lineHeight`, `letterSpacing` or `fontStretch`. If no role fits and the need repeats, add a role to `textRoles` in the tokens, so every screen gets it. A one-off specimen (showing the type itself) may set them with a written `edge-allow type-roles:` reason.
- For emphasis inside a role, use `<strong>` (the label weight) or `<i>`; for a color, the Typography `color` prop.

## Layout
- Grids come from `Columns` with a named `preset` (`halves`, `thirds`, `quarters`, `aside`, `numbered`, `contents`, `wideNarrow`…). A screen never writes `gridTemplateColumns`. A one-off shape, like columns sized to a set of prints, goes in `Columns`' `template` prop, where it reads as one. If a template appears twice, make it a preset.
- Sections are `Section` (it owns the space between sections and the heading); contents-style lists are `RuleList` and `RuleItem`; headline numbers are `StatGrid` and `Stat`; code is `CodeBlock`; tables outside MUI's Table are `DataTable`.
- `sx` is for composition: the space between two blocks, a one-off position. If the same `sx` appears on two screens, it belongs in the theme or a primitive.

## Space and shape
- Spacing comes from the 4px-based scale (`space`): 4, 8, 12, 16, 24, 32, 48, 64.
- Corners are square (`radius` is 0). Don't round cards, buttons or inputs.

## Motion
- Motion answers something a person did or a page arriving: opening, switching a view, landing on a page. Nothing loops, and nothing moves just to decorate.
- Use the `motion` tokens: `quick` (140ms) for state changes like hover and press, `base` (240ms) for switching views, `enter` (420ms) for content arriving. Ease with `motion.ease.enter`.
- Arriving content fades and rises `motion.rise` (8px). It moves into place; it doesn't fly in.
- One arrival per page. Don't stagger every card or animate each section as it scrolls into view.
- Under `prefers-reduced-motion: reduce`, every transition becomes an instant change; meaning never depends on movement.

## Composition
- One primary (filled) button per view; other actions are outlined or text buttons.
- Every input has a visible label. Errors appear in words directly under the field.
- Decorative details (stripes, stitch lines, wall-art shapes, ghost words) are `aria-hidden` and never carry meaning.
- Every screen has one focus ring style: the theme's. Don't remove outlines.
- A screen is a part of a page, so it never declares page landmarks: no `<main>`, `component="main"` or `role="main"`. The app shell owns `main`, the header and navigation; use `section` with a heading or `aria-label` instead.

## States beyond the happy path
Design these for every data view: loading, empty (with a next step), error (with a recovery action), partial data, long text, and no permission.
