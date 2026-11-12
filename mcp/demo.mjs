// Connects to the Edge MCP server the way an assistant would and calls each tool once.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const client = new Client({ name: 'edge-demo', version: '1.0.0' });
await client.connect(new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('./server.mjs', import.meta.url))],
}));
const { tools } = await client.listTools();
console.log('tools:', tools.map((t) => t.name).join(', '));
const calls = [
  ['get_tokens', { mode: 'paper', accent: 'blue' }],
  ['get_component_guidance', { component: 'SummaryCard' }],
  ['check_contrast', { foreground: 'paper.muted', background: 'paper.surface' }],
  ['check_contrast', { foreground: '#9AA0A6', background: '#FFFFFF' }],
];
for (const [name, args] of calls) {
  const r = await client.callTool({ name, arguments: args });
  console.log(`\n> ${name} ${JSON.stringify(args)}\n${r.content[0].text.slice(0, 600)}`);
}
await client.close();
