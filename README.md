# Edge

A small, accessible design system for React and MUI, by [Ben Viwatmanitsakul](https://bensumet.github.io). The look comes from a leather workshop and a print studio. Edge ships with written rules that people and coding agents follow, and with checks that fail the build when a screen breaks them.

- **Live docs and examples:** [bensumet.github.io → Design system](https://bensumet.github.io/#/system)
- **Package:** `@bensumet/edge` on GitHub Packages
- **Changes:** [CHANGELOG.md](CHANGELOG.md)

## What's in it

- **A theme on CSS variables.** Two modes, Ink (dark) and Paper (light), and five accents. Every color is a `--edge-palette-*` variable, so switching mode is one attribute change, not a re-render. Every text and accent pair is tested for WCAG AA.
- **Text roles.** Each piece of text is a named role (`prose`, `lead`, `label`, `eyebrow`, `metric`, `mono`…), set with `<Typography variant="…">`. Screens never set font, size or line spacing themselves.
- **Layout primitives.** `Columns` with named presets, `Section`, `RuleList`, `StatGrid`, `CodeBlock`, `DataTable` and more. Screens never write grid templates.
- **Components** for AI interfaces (`AiLabel`, `SummaryCard`, `SuggestionList`, `FeedbackBar`, `StreamingText`), cards and display type.
- **Rules for agents.** One short rules file per component, an `llms.txt` index, an MCP server, and a static rules check.

## Install

Edge is published to GitHub Packages, which needs a GitHub token to install, even for a public package. Create a token with the `read:packages` scope, then add an `.npmrc` next to your `package.json`:

```
@bensumet:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install Edge with its peers, and the fonts it's designed for:

```bash
npm install @bensumet/edge @mui/material @emotion/react @emotion/styled
npm install @fontsource/eb-garamond @fontsource/inter @fontsource-variable/archivo
```

In GitHub Actions, the workflow's own `GITHUB_TOKEN` works once the repository is given read access in the package's settings.

## Set up

Wrap the app in `EdgeThemeProvider` and load the fonts once:

```tsx
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource-variable/archivo/wdth.css';
import { EdgeThemeProvider } from '@bensumet/edge';

createRoot(root).render(
  <EdgeThemeProvider defaultMode="ink">
    <App />
  </EdgeThemeProvider>,
);
```

To avoid a flash of the wrong mode on load, set the attribute before the app starts, in the page's `<head>`:

```html
<script>
  (function () {
    var m; try { m = localStorage.getItem('edge.color-mode'); } catch (e) {}
    if (m === 'system') m = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-edge-mode', m === 'light' ? 'light' : 'dark');
  })();
</script>
```

## Use

```tsx
import { Typography } from '@mui/material';
import { Columns, Lead, Section } from '@bensumet/edge';

export function Principles() {
  return (
    <Section id="principles" title="Principles" intro="What the system holds to.">
      <Lead opening="Every screen">reads its colors from the theme.</Lead>
      <Columns preset="thirds">
        <Typography variant="prose">Color marks focus, selection and the one primary action.</Typography>
        <Typography variant="prose">Corners are square.</Typography>
        <Typography variant="prose">Every state is designed: loading, empty and error.</Typography>
      </Columns>
    </Section>
  );
}
```

In `styled()` components and theme callbacks, read colors as `theme.vars.palette.*`, so they follow the mode. Read [`rules/00-foundations.md`](rules/00-foundations.md) before building a screen.

## For coding agents

- **Rules:** [`rules/`](rules), one file per component, with when to use it, when not to, its props and its accessibility requirements. A test fails the build if a component ships without one.
- **Index:** `@bensumet/edge/llms.txt` lists the rules and the token files.
- **MCP server:** `claude mcp add edge -- npx edge-mcp`. It gives an assistant three tools: `get_tokens`, `get_component_guidance` and `check_contrast`. See [`mcp/README.md`](mcp/README.md).
- **Rules check:** `npx edge-check-ui src/**/*.tsx` reads screens for hard-coded colors, hand-set type, hand-written grids, rounded corners, missing labels and more. Add it to your tests so a screen that breaks a rule fails the build.

## Tokens outside React

`@bensumet/edge/tokens.json` holds the tokens in W3C Design Tokens format: surfaces, accents, status colors, type and text roles, layout presets and spacing. `@bensumet/edge/tokens.css` has the same tokens as CSS custom properties, and each text role as an `.edge-<role>` class. To serve them from a site, `npx edge-tokens public/edge` writes the token files, rules and `llms.txt` into a folder.

## Develop

```bash
npm install
npm test          # builds, then runs contrast, rules coverage, accessibility, checker and MCP tests
npm run typecheck
```

Every change that affects people using Edge comes with a changeset (`npx changeset`). On `main`, the release workflow opens a "Version packages" pull request. Merging it bumps the version, writes the changelog and publishes to GitHub Packages. Versions follow semver: a change a screen has to adapt to is a major version.

## License

MIT. See [LICENSE](LICENSE).
