import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FooterColumnsExample } from './footer-columns.js';
import { NavigationMenuExample } from './navigation-menu.js';
import { StepperExample } from './stepper.js';

describe('compiled navigation composition examples', () => {
  it('retains footer state and honors disabled actions', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <FooterColumnsExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Select resource locally' }));
    expect(screen.getByText('Resource selected locally.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Select support locally' }));
    expect(screen.getByText('Support selected locally.')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Footer note'));
    await user.type(screen.getByLabelText('Footer note'), 'Retained note');
    await user.click(screen.getByRole('switch', { name: 'Disable footer action' }));
    expect(
      screen.getByRole('button', { name: 'Select resource locally' }),
    ).toBeDisabled();
  });
  it('operates both submenu orientations and disables actions', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <NavigationMenuExample />
      </ReacdProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Sample resources' });
    await user.click(trigger);
    await user.click(
      await screen.findByRole('button', { name: 'Open sample locally' }),
    );
    expect(screen.getByText('Sample opened locally.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Menu help locally' }));
    expect(screen.getByText('Menu help selected locally.')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Vertical navigation menu' }));
    await user.click(screen.getByRole('switch', { name: 'Disable menu action' }));
    await user.click(trigger);
    expect(
      await screen.findByRole('button', { name: 'Open sample locally' }),
    ).toBeDisabled();
    await user.keyboard('{Escape}');
    await user.clear(screen.getByLabelText('Menu group label'));
    expect(
      screen.getByRole('button', { name: 'Sample resources' }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText('Menu group label'), 'Renamed resources');
    expect(
      screen.getByRole('button', { name: 'Renamed resources' }),
    ).toBeInTheDocument();
  });
  it('retains Jotai step and field values across mode changes', async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <StepperExample />
      </ReacdProvider>,
    );
    await user.clear(screen.getByLabelText('Sample shipping address'));
    await user.type(
      screen.getByLabelText('Sample shipping address'),
      'Retained address',
    );
    await user.click(screen.getByRole('button', { name: /Sample payment/ }));
    await user.click(screen.getByRole('button', { name: /Sample confirmation/ }));
    expect(
      screen.getByText('Sample checkout reached confirmation.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Sample address/ }));
    expect(screen.getByLabelText('Sample shipping address')).toHaveValue(
      'Retained address',
    );
    for (const name of ['Linear sample steps', 'Vertical sample steps']) {
      await user.click(screen.getByRole('switch', { name }));
    }
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter} templateId="erp-compact">
        <StepperExample />
      </ReacdProvider>,
    );
    expect(screen.getByLabelText('Sample shipping address')).toHaveValue(
      'Retained address',
    );
    await user.click(screen.getByRole('switch', { name: 'Disable sample steps' }));
    expect(screen.getByRole('button', { name: /Sample address/ })).toBeDisabled();
  });
});
