```json
{ "name": "Display pieces", "kind": "component", "import": "PageHero, Lead, Tag, RunningHead", "summary": "Page openers and reading text: PageHero, Lead, Tag and RunningHead; one opener per page." }
```

# Display pieces

## PageHero
- One per page, at the top. Props: `folio` (written-out page number, "one"), `label` (the chapter word), `bold` (poster line), `italic` (Garamond line), optional `art` and `children` (an intro paragraph).
- Renders the page's only `h1`.

## Lead
- The first paragraph of a section. Props: `opening` (the first few words, set in small caps) and `children`.
- Use once per section; following paragraphs are ordinary body text.

## Tag
- A short label in a solid accent box. One or two words. Not a button; not interactive.

## RunningHead
- Decorative label row above a section, like a book's running head. Hidden from screen readers, so don't put information only here.
