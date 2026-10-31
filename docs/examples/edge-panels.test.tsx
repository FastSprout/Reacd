import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DrawerExample } from './drawer.js';
import { SlideoverExample } from './slideover.js';

describe.each([
  { name: 'Drawer', component: DrawerExample },
  { name: 'Slideover', component: SlideoverExample },
])('documented $name', ({ name, component: Component }) => {
  it('preserves Jotai notes and exercises every logical placement', async () => {
    const user = userEvent.setup();
    const lower = name.toLowerCase();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Component />
      </ReacdProvider>,
    );
    for (const edge of ['Top', 'Bottom', 'Start', 'End']) {
      await chooseOption(user, `${name} placement`, edge);
    }
    await user.click(screen.getByRole('switch', { name: `Lock ${lower} dismissal` }));
    await user.click(screen.getByRole('switch', { name: `Fullscreen ${lower}` }));
    await user.click(screen.getByRole('button', { name: `Open sample ${lower}` }));
    await user.clear(screen.getByLabelText(`${name} note`));
    await user.type(screen.getByLabelText(`${name} note`), 'Retained local note');
    await user.click(screen.getByRole('button', { name: `Save ${lower} note` }));
    expect(screen.getByText('Sample note saved locally.')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(screen.getByRole('button', { name: `Open sample ${lower}` }));
    expect(screen.getByLabelText(`${name} note`)).toHaveValue('Retained local note');
  });
});
