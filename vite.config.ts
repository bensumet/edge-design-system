import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Library build. Two entries: the React components and theme, and the bare
// tokens (no React) for Node scripts like the MCP server. React, MUI and
// Emotion are peers: the app supplies them, so there's one copy of each.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022',
    lib: {
      entry: { index: 'src/index.ts', tokens: 'src/tokens/node.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@mui\//, /^@emotion\//],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
});
