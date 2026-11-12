```json
{ "name": "FeedbackBar", "kind": "ai-pattern", "import": "FeedbackBar", "summary": "Lightweight yes/no feedback on AI output; a No opens an optional reason." }
```

# FeedbackBar

## Props
- `onSubmit` (`(vote: 'up' | 'down' | null, note: string) => void`, optional).

## Use it
- Under every AI draft or summary, once. Not on content a person wrote.

## Behavior
- Yes sends immediately. No asks "What was wrong? (optional)" so the signal is useful.
- After sending, a short thank-you replaces the controls.
