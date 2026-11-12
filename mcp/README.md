# Edge MCP server

Lets a coding assistant ask Edge directly instead of guessing. It reads the same token source and rules files as the site and the tests, so its answers can't drift from the code.

## Tools

| Tool | What it returns |
| --- | --- |
| `get_tokens` | Colors, type, spacing and radius for a mode (`ink` dark, `paper` light) and accent. |
| `get_component_guidance` | A component's rules (when to use it, when not to, props, accessibility) plus the foundations. Omit `component` to list them all. |
| `check_contrast` | The WCAG ratio between two colors, given as hex or tokens like `ink.text`, and whether it passes for text, large text or a control. |

## Connect it

In a project that has `@bensumet/edge` installed:

```bash
claude mcp add edge -- npx edge-mcp
```

Any MCP client that runs stdio servers can use the same command. Needs Node 20 or later.

## Try it

```bash
npm run build && node mcp/demo.mjs   # connects as a client and calls each tool once
```

`src/mcp.test.ts` runs the same calls on every test run.
