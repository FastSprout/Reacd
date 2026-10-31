import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ContentSearchButton, ReacdProvider } from '../../../index.js';

it('announces expansion and emits only the logical open value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <ContentSearchButton open={false} disabled onOpenChange={change} />
    </ReacdProvider>,
  );
  const button = screen.getByRole('button', { name: 'Search documentation' });
  expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  expect(button).toHaveAttribute('aria-expanded', 'false');
  await user.click(button);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <ContentSearchButton open onOpenChange={change} label="Open docs" />
    </ReacdProvider>,
  );
  expect(button).toHaveAttribute('aria-expanded', 'true');
  await user.click(button);
  expect(change).toHaveBeenCalledWith(true);
});
