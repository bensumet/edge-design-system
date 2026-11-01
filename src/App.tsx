import { lazy, Suspense, useEffect, useState } from 'react';
import {
  AppBar, Box, Container, Link, Stack, Tab, Tabs, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, Typography,
} from '@mui/material';
import { useEdgeSettings } from './theme/EdgeThemeProvider';
import { edgeColor, edgeLabel, edges, typography, type EdgeName } from './tokens/tokens';
import { ChapterStripes } from './components/type/Display';
// Each page loads on demand, so the first visit only downloads what it shows.
const FoundationsPage = lazy(() => import('./pages/FoundationsPage').then((m) => ({ default: m.FoundationsPage })));
const ComponentsPage = lazy(() => import('./pages/ComponentsPage').then((m) => ({ default: m.ComponentsPage })));
const StudioPage = lazy(() => import('./pages/StudioPage').then((m) => ({ default: m.StudioPage })));
const AiPatternsPage = lazy(() => import('./pages/AiPatternsPage').then((m) => ({ default: m.AiPatternsPage })));

const pages = [
  { id: 'foundations', label: 'Foundations', Component: FoundationsPage },
  { id: 'components', label: 'Components', Component: ComponentsPage },
  { id: 'studio', label: 'Studio', Component: StudioPage },
  { id: 'ai', label: 'AI patterns', Component: AiPatternsPage },
] as const;

type PageId = (typeof pages)[number]['id'];

// Hash routing keeps the site working on GitHub Pages with no server rewrites.
function usePage(): [PageId, (id: PageId) => void] {
  const parse = (): PageId => {
    // Plain #name routes; older #/name links still work.
    const id = window.location.hash.replace(/^#\/?/, '');
    return (pages.find((p) => p.id === id)?.id ?? 'foundations') as PageId;
  };
  const [page, setPage] = useState<PageId>(parse);
  useEffect(() => {
    const onHash = () => setPage(parse());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (id: PageId) => {
    window.location.hash = id;
  };
  return [page, go];
}

function EdgePicker() {
  const { edge, setEdge, mode } = useEdgeSettings();
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={edge}
      onChange={(_, v: EdgeName | null) => v && setEdge(v)}
      aria-label="Edge color"
    >
      {(Object.keys(edges) as EdgeName[]).map((name) => (
        <Tooltip key={name} title={edgeLabel(name, mode)}>
          <ToggleButton value={name} aria-label={`${edgeLabel(name, mode)} edge`} sx={{ px: 1 }}>
            <Box
              sx={{
                width: 16, height: 16, borderRadius: '50%',
                bgcolor: edgeColor(name, mode),
              }}
            />
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}

function ModePicker() {
  const { mode, setMode } = useEdgeSettings();
  return (
    <ToggleButtonGroup exclusive size="small" value={mode} onChange={(_, v) => v && setMode(v)} aria-label="Color mode">
      <ToggleButton value="ink" sx={{ px: 1.5 }}>Ink</ToggleButton>
      <ToggleButton value="paper" sx={{ px: 1.5 }}>Paper</ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function App() {
  const [page, go] = usePage();
  const Current = pages.find((p) => p.id === page)!.Component;

  useEffect(() => {
    document.title = `${pages.find((p) => p.id === page)!.label} · Edge Design System`;
  }, [page]);

  return (
    <>
      <Link
        href="#main"
        onClick={(e: React.MouseEvent) => {
          // Move focus without touching the hash, which drives page routing.
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        sx={{
          position: 'absolute', left: 8, top: -48, zIndex: 2000, p: 1, bgcolor: 'primary.main', color: 'primary.contrastText',
          borderRadius: 1, '&:focus': { top: 8 },
        }}
      >
        Skip to content
      </Link>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ top: 'env(safe-area-inset-top, 0px)', borderBottom: 1, borderColor: 'text.primary', bgcolor: 'background.default' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: { xs: 1, md: 0 } }}>
          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mr: 'auto' }}>
            <Typography
              component="p"
              sx={{ fontFamily: typography.poster, fontWeight: 850, fontSize: '1.9rem', lineHeight: 1, letterSpacing: '-0.05em' }}
            >
              edge<Box component="span" sx={{ fontWeight: 200, color: 'primary.main' }}>system</Box>
            </Typography>
            <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontFamily: typography.display, fontStyle: 'italic', fontSize: '1.05rem' }}>
              a design system from the workbench
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <EdgePicker />
            <ModePicker />
          </Stack>
        </Toolbar>
        <Container maxWidth="lg">
          <Tabs
            value={page}
            onChange={(_, v: PageId) => go(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            aria-label="Sections"
          >
            {pages.map((p) => (
              <Tab key={p.id} value={p.id} label={p.label} href={`#${p.id}`} component="a" onClick={(e: React.MouseEvent) => e.preventDefault()} />
            ))}
          </Tabs>
        </Container>
      </AppBar>
      <Container component="main" id="main" tabIndex={-1} maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, outline: 'none' }}>
        <Suspense fallback={<Typography color="text.secondary" role="status">Loading…</Typography>}>
          <Current />
        </Suspense>
      </Container>
      <ChapterStripes direction="vertical" sx={{ height: 14, mt: 8 }} />
      <Box component="footer" sx={{ bgcolor: 'edge.tint', overflow: 'hidden', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography
            aria-hidden="true"
            sx={{ fontFamily: typography.poster, fontSize: 'clamp(3.5rem, 1rem + 11vw, 11rem)', lineHeight: 0.8, letterSpacing: '-0.06em', whiteSpace: 'nowrap' }}
          >
            <Box component="span" sx={{ fontWeight: 850 }}>edge</Box>
            <Box component="span" sx={{ fontWeight: 200, color: 'primary.main' }}>system</Box>
          </Typography>
          <Typography variant="body2" sx={{ mt: 3, maxWidth: '62ch' }}>
            Designed and built by Ben Viwatmanitsakul. Leather goods and paintings are my own work; prices, clients and orders are sample data.{' '}
            <Link href="https://github.com/bensumet" color="primary">GitHub</Link>
          </Typography>
        </Container>
      </Box>
    </>
  );
}
