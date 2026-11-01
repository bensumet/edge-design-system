import { useMemo, useState } from 'react';
import {
  Box, Button, CardContent, Chip, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Lead } from '../components/type/Lead';
import { PageHero } from '../components/type/Display';
import { EdgeCard } from '../components/EdgeCard';
import { commissions, paintings, pieces, type Commission, type Painting, type Piece } from '../data/studio';

const statusColor: Record<Piece['status'], 'success' | 'info' | 'default'> = {
  Available: 'success',
  'Made to order': 'info',
  Sold: 'default',
};

const stageOrder: Commission['stage'][] = ['Design', 'Cutting', 'Stitching', 'Edge finishing', 'Ready'];

function Catalog() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | Piece['status']>('All');
  const shown = useMemo(
    () =>
      pieces.filter(
        (p) =>
          (status === 'All' || p.status === status) &&
          `${p.name} ${p.kind} ${p.leather} ${p.edge}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, status],
  );

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Search pieces" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1 }} />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select labelId="status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            {['All', 'Available', 'Made to order', 'Sold'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <Typography variant="body2" color="text.secondary" role="status" aria-live="polite">
        {shown.length} of {pieces.length} pieces
      </Typography>
      <Grid container spacing={3} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {shown.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }} component="li">
            <EdgeCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box component="img" src={p.image} alt={p.alt} loading="lazy" sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Typography variant="h4" component="h3">{p.name}</Typography>
                  <Typography variant="h5" component="p">${p.price}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {p.kind} · {p.leather} leather · {p.edge} edge
                </Typography>
                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Chip size="small" variant="outlined" label={p.status} color={statusColor[p.status]} />
                </Box>
              </CardContent>
            </EdgeCard>
          </Grid>
        ))}
      </Grid>
      {shown.length === 0 && (
        <EdgeCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography>No pieces match. </Typography>
          <Button onClick={() => { setQuery(''); setStatus('All'); }}>Clear filters</Button>
        </EdgeCard>
      )}
    </Stack>
  );
}

function Gallery() {
  const [open, setOpen] = useState<Painting | null>(null);
  return (
    <>
      <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {paintings.map((p) => (
          <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }} component="li">
            <Box
              component="button"
              onClick={() => setOpen(p)}
              aria-label={`Open ${p.title}`}
              sx={{
                p: 0, border: 0, bgcolor: 'transparent', width: '100%', cursor: 'zoom-in', color: 'inherit', textAlign: 'left',
                borderRadius: 2, '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 3 },
              }}
            >
              {/* Each painting sits whole on a mat, the way it would be framed; nothing is cropped. */}
              <Box
                sx={{
                  aspectRatio: '4 / 5',
                  bgcolor: 'edge.raised',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: { xs: 1.25, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="img" src={p.image} alt="" sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }} />
              </Box>
              <Typography variant="h5" component="span" sx={{ display: 'block', mt: 1 }}>{p.title}</Typography>
              <Typography variant="body2" component="span" color="text.secondary">{p.series}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="md" fullWidth aria-labelledby="painting-title">
        {open && (
          <>
            <DialogTitle id="painting-title" sx={{ pr: 7 }}>
              {open.title}
              <IconButton aria-label="Close" onClick={() => setOpen(null)} sx={{ position: 'absolute', right: 12, top: 12 }}>
                <span aria-hidden="true">✕</span>
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box component="img" src={open.image} alt={open.alt} sx={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>{open.series} · digital painting</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}

function Commissions() {
  return (
    <EdgeCard>
      <TableContainer>
        <Table>
          <caption style={{ captionSide: 'top', textAlign: 'left', padding: '16px 16px 0' }}>Open commissions, sample data</caption>
          <TableHead>
            <TableRow>
              <TableCell scope="col">Order</TableCell>
              <TableCell scope="col">Client</TableCell>
              <TableCell scope="col">Item</TableCell>
              <TableCell scope="col">Edge</TableCell>
              <TableCell scope="col">Due</TableCell>
              <TableCell scope="col">Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions.map((c) => {
              const step = stageOrder.indexOf(c.stage) + 1;
              return (
                <TableRow key={c.id} hover>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>{c.id}</TableCell>
                  <TableCell>{c.client}</TableCell>
                  <TableCell>{c.item}</TableCell>
                  <TableCell>{c.edge}</TableCell>
                  <TableCell>
                    {new Date(`${c.due}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant={c.stage === 'Ready' ? 'filled' : 'outlined'}
                      color={c.stage === 'Ready' ? 'primary' : 'default'}
                      label={`${c.stage} · ${step} of ${stageOrder.length}`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </EdgeCard>
  );
}

const tabs = [
  { id: 'catalog', label: 'Leather goods' },
  { id: 'gallery', label: 'Paintings' },
  { id: 'commissions', label: 'Commissions' },
] as const;

export function StudioPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('catalog');
  const totals = {
    available: pieces.filter((p) => p.status === 'Available').length,
    open: commissions.filter((c) => c.stage !== 'Ready').length,
    ready: commissions.filter((c) => c.stage === 'Ready').length,
  };

  return (
    <Stack spacing={4}>
      <Box>
        <PageHero folio="three" label="Studio" bold="The system" italic="at work.">
          <Lead opening="A small maker’s dashboard">
            built only from Edge components. The leather goods and paintings are mine; the prices and orders are
            sample data.
          </Lead>
        </PageHero>
      </Box>

      <Grid container spacing={2}>
        {[
          ['Pieces available', totals.available],
          ['Commissions in progress', totals.open],
          ['Ready to ship', totals.ready],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <EdgeCard painted sx={{ p: 2.5 }}>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="h2" component="p" className="tabular">{value}</Typography>
            </EdgeCard>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Studio views" sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          {tabs.map((t) => (
            <Tab key={t.id} value={t.id} label={t.label} id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} />
          ))}
        </Tabs>
        {tabs.map((t) => (
          <Box key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={tab !== t.id}>
            {tab === t.id && (t.id === 'catalog' ? <Catalog /> : t.id === 'gallery' ? <Gallery /> : <Commissions />)}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
