```json
{ "name": "EdgeCard", "kind": "component", "import": "EdgeCard", "summary": "The base surface. Optional painted top edge and stitch line, both decorative." }
```

# EdgeCard

The base surface for grouped content. It extends MUI `Card`.

## Use it for
- A group of related content: a summary, a form section, a list item with actions.

## Don't use it for
- Page layout or whole-page wrappers. Use plain `Box` and spacing.
- Nesting cards inside cards.

## Props
- `painted` (boolean): adds the chapter stripes along the top edge. Use on at most one or two cards per screen, for the most important content.
- `stitched` (boolean): adds a dashed inset line. Decorative; use sparingly.
- Everything else from MUI `Card`, including `component` (for example `component="li"` inside a list).

## Accessibility
- The painted edge and stitch line are drawn with pseudo-elements and carry no meaning.
- If the card is a list item, render it as `li` inside a `ul` or `ol`.

## Example
```tsx
<EdgeCard painted sx={{ p: 3 }}>
  <Typography variant="h4" component="h3">Renewal summary</Typography>
  …
</EdgeCard>
```
