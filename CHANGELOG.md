# @bensumet/edge

## 2.0.0

Edge's first release as a standalone package. Until now it lived inside the portfolio repo and was compiled along with the site.

### Breaking changes

- **The theme runs on CSS variables.** Both modes are generated as `--edge-palette-*` variables and switched by the `data-edge-mode` attribute, so changing mode no longer re-renders the page. `createEdgeTheme(edge)` now takes only the accent; the mode argument is gone.
- **Read colors through `theme.vars.palette.*`** in `styled()` and theme callbacks. `theme.palette.*` is fixed to one mode, and `alpha()` bakes a color in at build time; for a translucent color, use the channel: `rgba(${theme.vars.palette.primary.mainChannel} / 0.2)`.
- **`palette.edge.stripes`** is an object (`s1` to `s5`), not an array.
- **The mode is stored under `edge.color-mode`** (`dark` or `light`). Apps that set the mode before the first paint should read that key.
- **`brandItalic` is now `byline`.**

### New

- **Text roles:** every piece of text is a Typography variant (`prose`, `lead`, `label`, `eyebrow`, `data`, `metric`, `mono`, `caption`, the poster and hero roles, and more). Each one is listed with its purpose in `tokens.json` under `font.role`, and as an `.edge-<role>` class in `tokens.css`.
- **Layout primitives:** `Columns` (named presets, or a `template` for a one-off), `Section`, `RuleList` and `RuleItem`, `StatGrid` and `Stat`, `Headline`, `CodeBlock`, `DataTable`, `Measure`, and `ModeScope` for showing both modes side by side. Each one is registered with the theme under its own name, so it can be restyled in one place.
- **Theme-level link styles:** `<Link variant="nav">` and `<Link variant="tab">` for navigation, and whole-block links (`underline="none" color="inherit"`) that light up in the accent.
- **Rules check:** three new checks: `type-roles`, `layout-presets` and `theme-vars`.
- **Command-line tools:** `edge-check-ui` (the rules check), `edge-mcp` (the MCP server) and `edge-tokens` (writes the token files into a folder, for a site to serve).
