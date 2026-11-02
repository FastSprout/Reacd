import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { expect, it, vi } from 'vitest';
import { MuiButton } from '../button/button.adapter.js';
import { MuiPageCard } from './page-card.adapter.js';
it('keeps native title actions separate from child controls', async () => {
  const press = vi.fn<() => void>();
  const child = vi.fn<() => void>();
  render(
    <MuiPageCard
      title="Settings"
      onPress={press}
      description="Preferences"
      header="Header"
      footer="Footer"
      leading="Leading"
      spotlight
      highlight
    >
      <MuiButton label="Child" onPress={child} />
    </MuiPageCard>,
  );
  const card = screen.getByRole('article', { name: 'Settings' });
  expect(card.className).toContain('MuiCard-root');
  expect(card).toHaveAttribute('tabindex', '0');
  await userEvent.click(screen.getByRole('button', { name: 'Child' }));
  expect(child).toHaveBeenCalledWith();
  expect(press).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(press).toHaveBeenCalledWith();
});
it.each(['solid', 'outline', 'soft', 'subtle', 'ghost', 'naked'] as const)(
  'uses the native %s surface without changing declared content',
  (variant) => {
    const view = render(
      <MuiPageCard
        title="Card"
        variant={variant}
        intent="danger"
        orientation="horizontal"
        reverse
      >
        Content
      </MuiPageCard>,
    );
    expect(screen.getByRole('article', { name: 'Card' }).className).toContain(
      'MuiPaper-root',
    );
    expect(view.container.textContent?.indexOf('Content')).toBeLessThan(
      view.container.textContent?.indexOf('Card') ?? 0,
    );
  },
);
it.each(['neutral', 'primary', 'danger'] as const)(
  'retains native verified foreground pairs for solid %s intent',
  (intent) => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <MuiPageCard title="Card" variant="solid" intent={intent} />
      </ThemeProvider>,
    );
    const pair =
      intent === 'neutral'
        ? {
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.paper,
          }
        : intent === 'primary'
          ? {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }
          : {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            };
    expect(screen.getByRole('article', { name: 'Card' })).toHaveStyle(pair);
  },
);
it('supports an unnamed untitled native card', () => {
  render(<MuiPageCard />);
  expect(screen.getByRole('article').className).toContain('MuiCard-root');
});
