import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ContentSearchButton, ReacdProvider } from '../../../index.js';

it('renders the registered SDK icon button with a named search action', async () => {
  const change = vi.fn();
  const view = render(
    <ReacdProvider>
      <ContentSearchButton open={false} onOpenChange={change} />
    </ReacdProvider>,
  );
  const button = screen.getByRole('button', { name: 'Search documentation' });
  expect(button.className).toContain('w-9');
  expect(button.className).toContain('hover:bg-accent');
  expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  await userEvent.click(button);
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <ReacdProvider>
      <ContentSearchButton open label="Close docs search" onOpenChange={change} />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Close docs search' }));
  expect(change).toHaveBeenCalledWith(false);
  view.rerender(
    <ReacdProvider>
      <ContentSearchButton open disabled onOpenChange={change} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button')).toBeDisabled();
});

it('focuses its native button before notifying an external dialog opener', () => {
  const change = vi.fn(() => {
    expect(screen.getByRole('button')).toHaveFocus();
  });
  render(
    <ReacdProvider>
      <ContentSearchButton open={false} onOpenChange={change} />
    </ReacdProvider>,
  );
  const button = screen.getByRole('button', { name: 'Search documentation' });
  expect(button).not.toHaveFocus();
  fireEvent.click(button);
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
