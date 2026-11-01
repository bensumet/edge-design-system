# Edge

**A small, accessible design system drawn from a leather workshop and a painting studio.**

Edge is a React, TypeScript and MUI design system I built from my own crafts. Its colors come from my leather goods: quiet navy and black hide, with one bold painted edge per piece. Its typography comes from my training in book design. The demo site shows the system's foundations, its components, a small studio dashboard built only from those components, and a set of patterns for presenting AI output.

**Live demo:** https://bensumet.github.io/edge-design-system/

The leather goods and paintings in the demo are my own. Prices, clients and orders are sample data.

## What's inside

| Page | What it shows |
| --- | --- |
| Foundations | Color tokens with live WCAG contrast ratios, the type system, spacing |
| Components | Buttons, inputs, select, chips, dialog, notifications, a process rail and a data table |
| Studio | A maker's dashboard: a filterable catalog, a painting gallery with a lightbox, and a commissions table |
| AI patterns | Summaries with sources, recommendations you approve, streaming text with Stop, and editable drafts |

## Design decisions

### One accent, chosen like edge paint

Every piece I make in leather pairs a dark hide with a single edge color. Edge works the same way: neutral surfaces carry the content, and one accent carries focus, selection and the primary action. Visitors can switch the accent between orange, mint, red, purple and electric blue, and the whole system follows, because components read color only from the theme, never from hard-coded values.

### Contrast is tested, not eyeballed

Each edge color has two values: a bright one for the dark **ink** mode and a deepened one for the light **paper** mode, so the same hue still works as text and as a button fill. The test suite (`src/tokens/tokens.test.ts`) checks every pair the UI relies on:

- text and secondary text against every surface: 4.5:1 (WCAG 1.4.3)
- each accent as text, and text on each accent fill: 4.5:1
- input outlines against their surface: 3:1 (WCAG 1.4.11)
- status colors against surfaces: 4.5:1

A token change that breaks contrast fails CI before it can ship. The Foundations page computes the same ratios live, so what you see is what is tested.

### Typography from print

Three voices, as on a book cover and its pages. **Archivo**, a variable grotesque (width 62–125%, weight 100–900), sets poster-scale headlines. **EB Garamond** carries the italic counterpoint and the reading text, with true small caps for opening lines. **Inter** handles interface labels and numbers.

The page openers come straight from my print work in art school (shown in my portfolio):

- **Chapter stripes:** a stack of related colors down the edge of each opener, after the chapter openers of a 600-page guide I designed.
- **Running heads and a branching rule:** letterspaced labels across the top, and a fine rule that branches to two small labels, *Design* and *Code*, after the diagrams in my *Space and Place* book study.
- **Vertical type:** a letterspaced caption up the stripes, and one huge pale word set vertically down the far edge.
- **Wall-art compositions:** circles, rings, bars and arrows from my geometric wall pieces, drawn in the theme's colors.

The two modes have their own palettes: **ink** is navy hide with bright edge paints, and **paper** is ivory stock and gold leaf with jewel-tone accents (gold, emerald, garnet, amethyst, sapphire).

Details that matter at reading size:

- a 1.25 type scale, with display sizes set tight and slightly negative-tracked
- reading text held to about 66 characters per line with generous leading
- tabular figures wherever numbers sit in columns
- balanced headline wrapping and orphan-avoiding paragraphs (`text-wrap`)

### Signature details, never load-bearing

The painted top edge on cards and the dashed stitch lines are decorative and hidden from assistive technology. They give the system its character without ever being the only way something is communicated.

The **process rail** comes from a type study I made in school, where one customer information guide was organized 21 ways; one version hung everything from a single hairline rule with markers. Every decorative copy of a word (running heads, pale words, vertical captions) is hidden from screen readers, so each word is read exactly once. Progress shows three ways (filled markers, a "current" label and step order), so it never depends on color alone.

### AI that shows its work

The AI patterns follow four rules:

1. **Label it.** Machine-written text carries an "AI draft" label until a person edits it.
2. **Show the source.** Summary points cite the messages they came from, and the sources open in place.
3. **Keep people in control.** Suggestions explain their reasoning and change nothing until accepted; dismissals can be undone; streaming can be stopped, keeping the partial draft.
4. **Make "wrong" easy to say.** Every draft has lightweight feedback with an optional reason.

Streaming text announces once to screen readers when it completes, instead of reading out every word.

### Accessibility throughout

- one consistent, high-contrast focus ring for keyboard users, plus a skip link
- visible labels on every input, with errors written in words directly under the field
- dialogs that trap focus and return it to the button that opened them
- real tables with captions and header scopes
- written alt text for every photo of my work

## Engineering

- **React 18, TypeScript (strict), MUI 6**, built with Vite
- **Tokens to theme:** `src/tokens/tokens.ts` holds every raw value; `src/theme/createEdgeTheme.ts` turns them into an MUI theme for any mode and accent
- **Code-split pages:** each page loads on demand
- **Hash routing,** so the static site works on GitHub Pages with no server rewrites
- **Tests:** Vitest and Testing Library, covering contrast and the AI components' behavior
- **CI/CD:** GitHub Actions type-checks, tests and builds every push, and deploys `main` to GitHub Pages

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm test         # run the tests
npm run build    # production build
```

## About

I'm Ben Viwatmanitsakul, a design engineer and frontend architect. I studied graphic design before computer science, and I still design and build the interfaces I work on. Most of my professional work lives in private company repositories; Edge is a place to show how I think about design systems in the open.
