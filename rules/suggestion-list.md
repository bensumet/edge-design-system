```json
{ "name": "SuggestionList", "kind": "ai-pattern", "import": "SuggestionList", "summary": "AI recommendations with their reasons; nothing changes until a person accepts, and every decision can be undone." }
```

# SuggestionList

Recommendations the person stays in control of.

## Props
- `suggestions` (`{ id: string; title: string; reason: string; swatch?: string }[]`): `reason` explains why, in one sentence a person can evaluate. `swatch` is an optional decorative color chip.
- `onDecide` (`(id, 'accepted' | 'dismissed' | null) => void`, optional): called on Accept, Dismiss and Undo (`null`). Apply the change on `accepted` and reverse it on `null`.

## Behavior
- Each suggestion has Accept (outlined) and Dismiss (text). Neither is filled, so the view's one filled button stays the page's main action.
- Each suggestion has Accept and Dismiss. Neither is final: both show Undo.
- Accepting a suggestion is the only thing that changes data.

## Write reasons like this
- "Matches the 14 vehicles on the fleet schedule." Not "Recommended for you."
