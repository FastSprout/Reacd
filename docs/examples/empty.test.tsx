import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { EmptyExample } from './empty.js';
describe('documented Empty example', () => {
  it('preserves recovery data across surface and busy changes', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <EmptyExample />
      </ReacdProvider>,
    );
    await user.type(screen.getByLabelText('Empty recovery query'), 'Keep this query');
    for (const [name, options] of [
      ['Empty size', ['Small', 'Large', 'Medium']],
      ['Empty variant', ['Solid', 'Soft', 'Subtle', 'Naked', 'Outline']],
    ] as const)
      for (const option of options) {
        await chooseOption(user, name, option);
      }
    await user.click(screen.getByRole('switch', { name: 'Empty loading signal' }));
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing local data');
    await user.click(screen.getByRole('button', { name: 'Create sample record' }));
    expect(screen.getByText('Local sample records created: 1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Empty state help' }));
    expect(
      screen.getByText('Change the query or create a local record.'),
    ).toBeInTheDocument();
    for (const name of ['Show empty media', 'Show empty footer']) {
      await user.click(screen.getByRole('switch', { name }));
      await user.click(screen.getByRole('switch', { name }));
    }
    expect(screen.getByLabelText('Empty recovery query')).toHaveValue(
      'Keep this query',
    );
    await user.clear(screen.getByLabelText('Empty title'));
    await user.clear(screen.getByLabelText('Empty description'));
    expect(
      screen.getByRole('region', { name: 'No sample records' }),
    ).toBeInTheDocument();
  });
});
