```json
{ "name": "Buttons, inputs and dialogs", "kind": "component", "import": "@mui/material", "summary": "Edge styles MUI's Button, TextField, Select, Chip and Dialog through the theme; use them as they are." }
```

# Buttons, inputs and dialogs

Edge doesn't wrap MUI's basic controls. The theme styles them, so use them directly from `@mui/material` inside `EdgeThemeProvider`.

## Button
- `variant="contained"` for the one primary action in a view. `outlined` for secondary actions, `text` for low-emphasis ones.
- Label with a verb: "Save changes", "Send", not "OK".
- Destructive actions use `color="error"` and say what they destroy: "Delete draft".

## TextField and Select
- Always pass `label`; never rely on `placeholder` as the label.
- Show errors with `error` and `helperText` written as a sentence: "Enter a date after the start date."
- Don't disable submit to signal errors; let people submit and show what to fix.

## Chip
- For filters and short status labels. Status chips pair color with a word.

## Dialog
- Use for decisions that block the flow. Title states the decision; the primary button repeats the verb.
- MUI traps focus and returns it to the opener; don't override that.

## Don't
- Don't pass `sx={{ color: '#…' }}` or `bgcolor` hex values. Use theme keys.
- Don't round corners back with `borderRadius`.
