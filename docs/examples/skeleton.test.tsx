import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SkeletonExample } from './skeleton.js';
describe('documented Skeleton example', () => {
  it('changes semantic shapes, sizes, lines, status and visibility', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <SkeletonExample />
      </ReacdProvider>,
    );
    const current = within(screen.getByRole('region', { name: 'Current placeholder' }));
    for (const [name, options] of [
      ['Placeholder lines', ['One line', 'Eight lines', 'Three lines']],
      ['Placeholder size', ['Small', 'Large', 'Medium']],
      ['Placeholder shape', ['Avatar', 'Rectangle', 'Text']],
    ] as const)
      for (const option of options) {
        await chooseOption(user, name, option);
      }
    await user.click(screen.getByRole('switch', { name: 'Animate placeholder' }));
    await user.click(screen.getByRole('switch', { name: 'Show placeholder' }));
    expect(current.queryByRole('status')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Show placeholder' }));
    expect(current.getByRole('status')).toHaveTextContent('Loading sample records');
    await user.clear(screen.getByLabelText('Placeholder status label'));
    expect(current.queryByRole('status')).toBeNull();
  });
});
