import { useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Snackbar, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { EdgeCard } from '../components/EdgeCard';
import { ProcessRail } from '../components/type/ProcessRail';
import { Lead } from '../components/type/Lead';
import { PageHero } from '../components/type/Display';
import { typography } from '../tokens/tokens';

function Section({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <Typography id={id} variant="h3" component="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: typography.measure }}>{intro}</Typography>
      <EdgeCard sx={{ p: { xs: 2, sm: 3 } }}>{children}</EdgeCard>
    </section>
  );
}

const leathers = ['Navy', 'Black', 'Chocolate', 'Oxblood', 'Natural'];

export function ComponentsPage() {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [leather, setLeather] = useState('');
  const [dialog, setDialog] = useState(false);
  const [toast, setToast] = useState(false);
  const nameError = touched && name.trim().length < 2;

  return (
    <Stack spacing={6}>
      <Box>
        <PageHero folio="two" label="Parts" bold="Built for hands" italic="and keyboards.">
          <Lead opening="Every control">
            is reachable with Tab, shows the same high-contrast focus ring, and keeps its label visible. Try tabbing
            through this page.
          </Lead>
        </PageHero>
      </Box>

      <Section id="buttons" title="Buttons" intro="One filled action per view, outlined for secondary actions, text for low-emphasis ones. Disabled buttons keep their label readable.">
        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
          <Button variant="contained">Place order</Button>
          <Button variant="outlined">Save for later</Button>
          <Button>View details</Button>
          <Button variant="contained" disabled>Sold out</Button>
          <Button variant="contained" color="error">Cancel commission</Button>
        </Stack>
      </Section>

      <Section id="inputs" title="Inputs" intro="Labels stay visible while typing. Errors appear directly under the field they belong to, in words, not only in color.">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Name to emboss"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              error={nameError}
              helperText={nameError ? 'Enter at least 2 characters, or leave the wallet unmarked.' : 'Up to 12 characters, embossed inside the left pocket.'}
              slotProps={{ htmlInput: { maxLength: 12 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="leather-label">Leather</InputLabel>
              <Select labelId="leather-label" label="Leather" value={leather} onChange={(e) => setLeather(e.target.value)}>
                {leathers.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
              <FormHelperText>Every hide is vegetable tanned.</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Gift wrap with waxed thread" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel control={<Switch />} label="Notify me when stitching starts" />
          </Grid>
        </Grid>
      </Section>

      <Section id="chips" title="Status chips" intro="Status always pairs a word with its color, so it reads the same in grayscale and for color-blind visitors.">
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label="Available" color="success" variant="outlined" />
          <Chip label="Made to order" color="info" variant="outlined" />
          <Chip label="Low stock" color="warning" variant="outlined" />
          <Chip label="Sold" variant="outlined" />
          <Chip label="Orange edge" color="primary" />
        </Stack>
      </Section>

      <Section id="feedback" title="Dialogs and notifications" intro="Dialogs trap focus and return it to the button that opened them. Notifications are announced to screen readers without stealing focus.">
        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
          <Button variant="outlined" onClick={() => setDialog(true)}>Cancel a commission</Button>
          <Button variant="outlined" onClick={() => setToast(true)}>Show a notification</Button>
        </Stack>
        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          Edge dye needs 24 hours to cure. Orders placed today ship Thursday.
        </Alert>
        <Dialog open={dialog} onClose={() => setDialog(false)} aria-labelledby="cancel-title" aria-describedby="cancel-desc">
          <DialogTitle id="cancel-title">Cancel this commission?</DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-desc">
              The leather for CM-1043 is already cut. Cancelling keeps the deposit and can’t be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialog(false)} autoFocus>Keep commission</Button>
            <Button color="error" variant="contained" onClick={() => setDialog(false)}>Cancel commission</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={toast}
          autoHideDuration={5000}
          onClose={() => setToast(false)}
          message="Order CM-1042 moved to edge finishing"
          action={<Button color="primary" size="small" onClick={() => setToast(false)}>Dismiss</Button>}
        />
      </Section>

      <Section id="rail" title="Process rail" intro="A hairline rule with a marker for each step, adapted from an information-design study I set on a single vertical rule. Progress shows as filled markers, a “current” label and step order, never color alone.">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProcessRail
              title="Commission CM-1042, bifold wallet"
              current={3}
              steps={[
                { label: 'Design approved', detail: 'Navy hide, orange edge, initials A.R.', meta: 'Oct 18' },
                { label: 'Cutting', detail: 'Panels and pockets cut from one hide', meta: 'Oct 22' },
                { label: 'Stitching', detail: 'Saddle stitched, 8 stitches per inch', meta: 'Oct 27' },
                { label: 'Edge finishing', detail: 'Bevel, sand, three coats, burnish', meta: 'Nov 3' },
                { label: 'Ready to ship', meta: 'Nov 8' },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProcessRail
              title="Painting, Rose in a bottle"
              current={3}
              steps={[
                { label: 'Reference and sketch', meta: 'Day 1' },
                { label: 'Block in light and shadow', meta: 'Day 2' },
                { label: 'Glass and reflections', meta: 'Days 3–4' },
                { label: 'Petals and final glazes', meta: 'Day 5' },
                { label: 'Signed', meta: 'Day 6' },
              ]}
            />
          </Grid>
        </Grid>
      </Section>

      <Section id="table" title="Data table" intro="A real table with a caption and column headers, so screen readers can announce each cell’s row and column.">
        <TableContainer>
          <Table size="small">
            <caption style={{ captionSide: 'top', textAlign: 'left', padding: '0 16px 8px' }}>Edge finishing steps</caption>
            <TableHead>
              <TableRow>
                <TableCell scope="col">Step</TableCell>
                <TableCell scope="col">Tool</TableCell>
                <TableCell scope="col" align="right">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Bevel the edge', 'Edge beveler', '10 min'],
                ['Sand smooth', '400 to 1000 grit', '15 min'],
                ['Apply edge paint', 'Roller, three coats', '3 × 20 min'],
                ['Burnish', 'Canvas and wax', '10 min'],
              ].map(([step, tool, time]) => (
                <TableRow key={step}>
                  <TableCell component="th" scope="row">{step}</TableCell>
                  <TableCell>{tool}</TableCell>
                  <TableCell align="right">{time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Stack>
  );
}
