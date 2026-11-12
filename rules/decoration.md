```json
{ "name": "Decoration", "kind": "component", "import": "ChapterStripes, DotRule, ArrowRule, WallArt, GhostWord, OutlineEcho, StitchDivider", "summary": "Decorative pieces from print work; all aria-hidden, never carry meaning, at most two per screen." }
```

# Decoration

`ChapterStripes`, `DotRule`, `ArrowRule`, `WallArt` (`planets`, `rings`, `verticals`, `arrows`), `GhostWord`, `OutlineEcho` and `StitchDivider` give Edge its character.

## Rules
- All are `aria-hidden`. Never put a word or a status only in a decorative piece.
- At most two decorative pieces per screen, and none inside dense data views (tables, forms, dashboards).
- They read color from the theme; don't recolor them by hand.
- `GhostWord` repeats a word that already appears as real text nearby.
