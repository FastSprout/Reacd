import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { HeaderExample } from './header.js';
import { userEvent } from '@testing-library/user-event';

describe('documented Header example', () => {
  it('renders its public declaration', () => {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <HeaderExample />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Component reference')).toBeVisible();
  });

  it('opens and closes its isolated Jotai menu', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <HeaderExample />
      </ReacdProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'reacd' })).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Component documentation' }),
    ).toHaveAttribute('href', '/components/');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('changes every placement and preserves its title input', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <HeaderExample />
      </ReacdProvider>,
    );
    const title = screen.getByLabelText('Header title');
    await user.clear(title);
    for (const mode of ['Modal', 'Slideover', 'Drawer']) {
      await chooseOption(user, 'Header menu mode', mode);
      await user.click(screen.getByRole('button', { name: 'Open navigation' }));
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-mode',
        mode.toLowerCase(),
      );
      await user.click(screen.getByRole('button', { name: 'Close navigation' }));
    }
    await user.type(title, 'Edited header');
    expect(screen.getByRole('link', { name: 'Edited header' })).toBeVisible();
  });
});
