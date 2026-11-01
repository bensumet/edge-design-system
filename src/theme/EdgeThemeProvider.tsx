import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createEdgeTheme } from './createEdgeTheme';
import type { EdgeName, Mode } from '../tokens/tokens';

interface EdgeSettings {
  mode: Mode;
  edge: EdgeName;
  setMode: (mode: Mode) => void;
  setEdge: (edge: EdgeName) => void;
}

const EdgeContext = createContext<EdgeSettings | null>(null);

function read<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private windows); the choice still applies for this visit.
  }
}

const MODES = ['ink', 'paper'] as const;
const EDGES = ['orange', 'mint', 'red', 'purple', 'blue'] as const;

export function EdgeThemeProvider({ children }: { children: ReactNode }) {
  const prefersLight =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches;
  const [mode, setMode] = useState<Mode>(() => read('edge.mode', prefersLight ? 'paper' : 'ink', MODES));
  const [edge, setEdge] = useState<EdgeName>(() => read('edge.edge', 'orange', EDGES));

  useEffect(() => write('edge.mode', mode), [mode]);
  useEffect(() => write('edge.edge', edge), [edge]);

  const theme = useMemo(() => createEdgeTheme(mode, edge), [mode, edge]);
  const value = useMemo(() => ({ mode, edge, setMode, setEdge }), [mode, edge]);

  return (
    <EdgeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EdgeContext.Provider>
  );
}

export function useEdgeSettings(): EdgeSettings {
  const ctx = useContext(EdgeContext);
  if (!ctx) throw new Error('useEdgeSettings must be used inside EdgeThemeProvider');
  return ctx;
}
