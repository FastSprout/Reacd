import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { BreadcrumbExample } from './breadcrumb.js';
describe('documented Breadcrumb example', () => {
  it('changes separators, path length and disabled actions', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <BreadcrumbExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Sample projects' }));
    expect(screen.getByText('Selected Sample projects locally.')).toBeInTheDocument();
    for (const option of ['Slash', 'Chevron']) {
      await chooseOption(user, 'Breadcrumb separator', option);
    }
    await user.click(screen.getByRole('switch', { name: 'Deep breadcrumb path' }));
    expect(screen.getByText('Sample ancestor 6')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Disable breadcrumb action' }));
    expect(screen.getByRole('button', { name: 'Sample projects' })).toBeDisabled();
    await user.clear(screen.getByLabelText('Breadcrumb final label'));
    expect(screen.getByText('Current record')).toHaveAttribute('aria-current', 'page');
  });
});
