```json
{ "name": "StreamingText", "kind": "ai-pattern", "import": "StreamingText", "summary": "Streams a draft word by word with Stop and Regenerate; screen readers hear it once, when complete." }
```

# StreamingText

## Props
- `text` (string): the full response.
- `speed` (number, ms per word, default 45).
- `autoStart` (boolean, default false).
- `placeholder` (string): shown before the first run.

## Behavior
- Stop keeps the partial draft; it doesn't erase work.
- Regenerate replaces the draft only after a person asks.
- One polite live-region announcement when complete, instead of announcing every word.
- Respect reduced motion: show the full text without animating.
