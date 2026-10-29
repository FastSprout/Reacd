import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ContentSearchButton, ReacdProvider } from '../../../index.js';

it('announces expansion and emits only the logical open value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider>
      <ContentSearchButton open={false} disabled onOpenChange={change} />
    </ReacdProvider>,
  );
  const button = screen.getByRole('button', { name: 'Search documentation' });
  expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  expect(button).toHaveAttribute('aria-expanded', 'false');
  await user.click(button);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider>
      <ContentSearchButton open onOpenChange={change} label="Open docs" />
    </ReacdProvider>,
  );
  expect(button).toHaveAttribute('aria-expanded', 'true');
  await user.click(button);
  expect(change).toHaveBeenCalledWith(true);
});
