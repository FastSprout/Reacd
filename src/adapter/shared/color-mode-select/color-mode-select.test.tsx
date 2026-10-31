import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../state/provider/provider.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { SharedColorModeSelect } from './color-mode-select.adapter.js';

it('retains host values and protects mode selection', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const props = {
    label: 'Appearance',
    value: 'system',
    resolvedMode: 'light',
    onValueChange: change,
  } as const;
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedColorModeSelect {...props} />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Appearance' });
  expect(trigger).toHaveTextContent('System');
  await user.click(trigger);
  await user.click(screen.getByRole('option', { name: /^Dark$/ }));
  expect(change).toHaveBeenCalledExactlyOnceWith('dark');
  expect(trigger).toHaveTextContent('System');
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedColorModeSelect
        {...props}
        readOnly
        description="Host palette"
        labels={{ system: 'Device', light: 'Day', dark: 'Night' }}
      />
    </ReacdProvider>,
  );
  expect(trigger).toHaveAccessibleDescription('Host palette');
  await user.click(trigger);
  await user.click(screen.getByRole('option', { name: /^Day$/ }));
  expect(change).toHaveBeenCalledOnce();
  expect(trigger).toHaveTextContent('Device');
});

it('keeps inactive mode portals closed', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <PortalActiveContext.Provider value={false}>
        <SharedColorModeSelect
          label="Inactive appearance"
          value="system"
          resolvedMode="light"
          onValueChange={() => undefined}
        />
      </PortalActiveContext.Provider>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Inactive appearance' }));
  expect(screen.queryByRole('option')).toBeNull();
});
