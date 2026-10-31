import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { installLayout } from '../../test-support/layout-observer.js';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReacdProvider } from '@fastsprout/reacd';
import { AvatarGroupExample } from './avatar-group.js';

let restoreLayout: () => void;
beforeEach(() => {
  restoreLayout = installLayout();
});
afterEach(() => restoreLayout());

describe('documented AvatarGroup example', () => {
  it('changes visible counts, empty state, and maximum-size data', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <AvatarGroupExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByText('Show 2 more people'));
    expect(screen.getByText(/Example reviewer long_identifier/)).toBeVisible();
    (await screen.findByRole('slider', { name: /^Visible people/ })).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Show 1 more person')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Empty avatar group' }));
    expect(screen.getByText('Nobody assigned in this example.')).toBeVisible();
    await user.click(screen.getByRole('switch', { name: 'Empty avatar group' }));
    await user.click(screen.getByRole('switch', { name: 'Use maximum-size group' }));
    expect(screen.getByText('Show 97 more people')).toBeInTheDocument();
    for (const size of ['Small', 'Large', 'Medium']) {
      await chooseOption(user, 'Group avatar size', size);
    }
  });
});
