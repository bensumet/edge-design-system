import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Box, CssBaseline, type BoxProps } from '@mui/material';
import { ThemeProvider, useColorScheme } from '@mui/material';
import { createEdgeTheme, MODE_ATTRIBUTE, modeFor, schemeFor } from './createEdgeTheme';
import type { EdgeName, Mode } from '../tokens/tokens';

interface EdgeSettings {
  mode: Mode;
  edge: EdgeName;
  setMode: (mode: Mode) => void;
  setEdge: (edge: EdgeName) => void;
}

const EdgeContext = createContext<EdgeSettings | null>(null);

/** Where the visitor's mode is remembered. The inline script in index.html reads the same key. */
export const MODE_STORAGE_KEY = 'edge.color-mode';
const EDGE_STORAGE_KEY = 'edge.edge';
const EDGES = ['orange', 'mint', 'red', 'purple', 'blue'] as const;

function readEdge(): EdgeName {
  try {
    const v = localStorage.getItem(EDGE_STORAGE_KEY) as EdgeName | null;
    return v && EDGES.includes(v) ? v : 'orange';
  } catch {
    return 'orange';
  }
}

/** Bridges MUI's color scheme to Edge's mode names (ink, paper). */
function Settings({ edge, setEdge, children }: { edge: EdgeName; setEdge: (e: EdgeName) => void; children: ReactNode }) {
  const { mode: scheme, systemMode, setMode: setScheme } = useColorScheme();
  const resolved = scheme === 'system' ? systemMode : scheme;
  const mode: Mode = resolved ? modeFor[resolved] : 'ink';
  const value = useMemo<EdgeSettings>(
    () => ({ mode, edge, setEdge, setMode: (m) => setScheme(schemeFor[m]) }),
    [mode, edge, setEdge, setScheme],
  );
  return <EdgeContext.Provider value={value}>{children}</EdgeContext.Provider>;
}

/**
 * Wraps an app in Edge. Both modes are CSS variables on <html>, so switching
 * mode doesn't re-render the tree; switching the accent rebuilds the theme.
 *
 * `defaultMode` sets the first-visit mode; without it, Edge follows the
 * visitor's system setting. A choice the visitor makes is remembered.
 */
export function EdgeThemeProvider({ children, defaultMode }: { children: ReactNode; defaultMode?: Mode }) {
  const [edge, setEdge] = useState<EdgeName>(readEdge);
  useEffect(() => {
    try { localStorage.setItem(EDGE_STORAGE_KEY, edge); } catch { /* storage can be unavailable; the choice still applies */ }
  }, [edge]);
  const theme = useMemo(() => createEdgeTheme(edge), [edge]);

  return (
    <ThemeProvider theme={theme} defaultMode={defaultMode ? schemeFor[defaultMode] : 'system'} modeStorageKey={MODE_STORAGE_KEY} disableTransitionOnChange>
      <CssBaseline />
      <Settings edge={edge} setEdge={setEdge}>{children}</Settings>
    </ThemeProvider>
  );
}

export function useEdgeSettings(): EdgeSettings {
  const ctx = useContext(EdgeContext);
  if (!ctx) throw new Error('useEdgeSettings must be used inside EdgeThemeProvider');
  return ctx;
}

/**
 * Shows its contents in a fixed mode, whatever the page is in: for showing
 * ink and paper side by side. The CSS variables follow the attribute.
 */
export function ModeScope({ mode, sx, ...rest }: { mode: Mode } & BoxProps) {
  return <Box {...{ [MODE_ATTRIBUTE]: schemeFor[mode] }} sx={{ bgcolor: 'background.default', color: 'text.primary', ...sx }} {...rest} />;
}
