```json
{ "name": "ProcessRail", "kind": "component", "import": "ProcessRail", "summary": "A vertical rail of steps on one hairline; progress shown three ways, never by color alone." }
```

# ProcessRail

## Props
- `title` (string): rendered as the figure caption.
- `steps` (`{ label: string; detail?: string; meta?: string }[]`)
- `current` (number): zero-based index of the current step.

## Use it for
- A linear process with three to eight steps: an application, an order, a review.

## Don't use it for
- Navigation between pages; use links. Non-linear processes; use a list with status chips.

## Accessibility
- Rendered as an ordered list. Done steps are filled markers, the current step says "Current", later steps are hollow.
