import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EdgeThemeProvider } from '../../theme/EdgeThemeProvider';
import { StreamingText } from './StreamingText';
import { SuggestionList } from './SuggestionList';
import { SummaryCard } from './SummaryCard';

const wrap = (ui: React.ReactElement) => render(<EdgeThemeProvider>{ui}</EdgeThemeProvider>);

describe('SuggestionList', () => {
  it('applies nothing until accepted, and dismissals can be undone', async () => {
    const user = userEvent.setup();
    wrap(<SuggestionList suggestions={[{ id: 'a', title: 'Orange', reason: 'Warm contrast.' }]} />);

    await user.click(screen.getByRole('button', { name: 'Dismiss Orange' }));
    expect(screen.getByRole('status')).toHaveTextContent('Dismissed');

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByRole('button', { name: 'Accept Orange' })).toBeInTheDocument();
  });
});

describe('SummaryCard', () => {
  it('labels the summary as AI and reveals its sources on demand', async () => {
    const user = userEvent.setup();
    wrap(
      <SummaryCard
        title="Brief"
        points={[{ text: 'Purple edge.', sources: ['m1'] }]}
        sources={[{ id: 'm1', label: 'Message', excerpt: 'Purple, please.' }]}
      />,
    );
    expect(screen.getByLabelText(/AI draft/)).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: 'Show 1 sources' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide sources' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Purple, please/)).toBeVisible();
  });
});

describe('StreamingText', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('can be stopped mid-stream and keeps the partial draft', () => {
    wrap(<StreamingText text="one two three four five" speed={10} />);
    act(() => screen.getByRole('button', { name: 'Generate' }).click());
    act(() => vi.advanceTimersByTime(25));
    act(() => screen.getByRole('button', { name: 'Stop' }).click());

    expect(screen.getByText(/Stopped/)).toBeInTheDocument();
    expect(screen.getByText(/one two/)).toBeInTheDocument();
    expect(screen.queryByText(/five/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regenerate' })).toBeInTheDocument();
  });

  it('announces once when the draft completes', () => {
    wrap(<StreamingText text="one two" speed={10} />);
    act(() => screen.getByRole('button', { name: 'Generate' }).click());
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('status')).toHaveTextContent('Draft complete.');
  });
});
