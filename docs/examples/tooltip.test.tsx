import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TooltipExample } from './tooltip.js';

describe('documented Tooltip example', () => {
  it('controls hints, placements, child actions, and dialog state', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <TooltipExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Run annotated action' }));
    expect(screen.getByText('Annotated action count: 1')).toBeInTheDocument();
    for (const value of ['Bottom', 'Inline start', 'Inline end', 'Top']) {
      await user.click(screen.getByRole('combobox', { name: 'Tooltip placement' }));
      await user.click(await screen.findByRole('option', { name: value }));
      expect(
        screen.getByRole('combobox', { name: 'Tooltip placement' }),
      ).toHaveTextContent(value);
    }
    for (const label of [
      'Controlled hint open',
      'Tooltip arrow',
      'Long tooltip text',
      'Disable tooltip child',
      'Disable tooltip',
    ]) {
      await user.click(screen.getByRole('switch', { name: label }));
    }
    await user.click(screen.getByRole('button', { name: 'Open tooltip dialog' }));
    await user.click(screen.getByRole('button', { name: 'Dialog sample action' }));
    expect(screen.getByText('Annotated action count: 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close tooltip dialog' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
