import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { KbdExample } from './kbd.js';
describe('documented Kbd example', () => {
  it('changes values, labels, platform, size, intent, and variant', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <KbdExample />
      </ReacdProvider>,
    );
    const current = within(screen.getByRole('region', { name: 'Current key' }));
    expect(current.getByRole('img', { name: 'Control' })).toHaveTextContent('Ctrl');
    for (const [control, options] of [
      ['Key platform', ['Apple', 'Other platforms']],
      ['Key size', ['Small', 'Large', 'Medium']],
      ['Key variant', ['Soft', 'Subtle', 'Solid', 'Outline']],
      ['Key intent', ['Primary', 'Danger', 'Secondary']],
    ] as const)
      for (const option of options) {
        await chooseOption(user, control, option);
      }
    await user.clear(screen.getByLabelText('Key value'));
    expect(current.getByRole('img', { name: 'K' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Key value'), 'F12');
    await user.type(screen.getByLabelText('Key accessible label'), 'Function key');
    expect(current.getByRole('img', { name: 'Function key' })).toHaveTextContent('F12');
  });
});
