// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Talks to the MCP server over stdio, the same way a coding assistant does.
const client = new Client({ name: 'edge-test', version: '1.0.0' });
const call = async (name: string, args: Record<string, unknown>) => {
  const r = (await client.callTool({ name, arguments: args })) as { content: { text: string }[]; isError?: boolean };
  return { text: r.content[0].text, isError: !!r.isError };
};

beforeAll(async () => {
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL('../mcp/server.mjs', import.meta.url))],
  }));
}, 20000);
afterAll(() => client.close());

describe('Edge MCP server', () => {
  it('offers the three tools', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(['check_contrast', 'get_component_guidance', 'get_tokens']);
  });

  it('returns tokens for one mode', async () => {
    const t = JSON.parse((await call('get_tokens', { mode: 'paper', accent: 'blue' })).text);
    expect(t.mode).toBe('paper');
    expect(t.accent.name).toBe('blue');
    expect(t.radius.md).toBe(0);
    expect(t.status.error).toMatch(/^#/);
  });

  it('returns a component’s rules with the foundations', async () => {
    const r = await call('get_component_guidance', { component: 'summary card' });
    expect(r.text).toContain('# SummaryCard');
    expect(r.text).toContain('Foundations');
  });

  it('says so when a component has no rules', async () => {
    const r = await call('get_component_guidance', { component: 'carousel' });
    expect(r.isError).toBe(true);
    expect(r.text).toContain('No rules found');
  });

  it('measures contrast from tokens and from hex', async () => {
    const ok = JSON.parse((await call('check_contrast', { foreground: 'paper.muted', background: 'paper.surface' })).text);
    expect(ok.passes).toBe(true);
    const bad = JSON.parse((await call('check_contrast', { foreground: '#9AA0A6', background: '#FFFFFF' })).text);
    expect(bad.passes).toBe(false);
    expect(bad.ratio).toBeCloseTo(2.64, 1);
  });
});
