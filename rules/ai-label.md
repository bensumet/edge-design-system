```json
{ "name": "AiLabel", "kind": "ai-pattern", "import": "AiLabel", "summary": "Marks machine-written content as an AI draft until a person edits or accepts it." }
```

# AiLabel

A small outlined chip reading "AI draft", with a tooltip.

## Use it
- On every piece of content a model wrote and a person hasn't yet edited or accepted: summaries, drafts, recommendations, predictions.
- Next to the content's title, not hidden in a footer.

## Remove it
- When a person edits the text or accepts the suggestion. The content is theirs from then on.

## Props
- `tip` (string, optional): the tooltip and accessible description. Default: "Drafted by AI. Review before using."

## Don't
- Don't use a different color, gradient or sparkle animation to mark AI. The label is the signal; the content should look like the rest of the product.
- Don't label content a person wrote.
