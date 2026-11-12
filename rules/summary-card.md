```json
{ "name": "SummaryCard", "kind": "ai-pattern", "import": "SummaryCard", "summary": "An AI summary where every point cites its source, and sources open in place to check." }
```

# SummaryCard

An AI summary that shows its work.

## Use it for
- Summaries of messages, documents, notes or records, where a person needs to trust or check each point.

## Props
- `title` (string)
- `points` (`{ text: string; sources: string[] }[]`): each point lists the ids of the sources it came from. Every point must have at least one source.
- `sources` (`{ id: string; label: string; excerpt: string }[]`): label names the source ("Email from the producer, Oct 27"); excerpt is the exact passage.

## Behavior
- Points show numbered citations. "Show sources" expands the list in place; nothing navigates away.
- Includes `AiLabel` and `FeedbackBar`.

## Don't
- Don't show a point with no source. If the model can't cite it, leave it out.
- Don't paraphrase the excerpt; it should be the source's own words so people can verify.
