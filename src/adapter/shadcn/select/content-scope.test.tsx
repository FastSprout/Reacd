import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  PortalActiveContext,
  PortalHostContext,
} from '../../../renderer/theme/portal-context.js';
import { ShadcnSelect } from './select.adapter.js';
import { ShadcnBaseSelectContent } from './select-base-content.adapter.js';

it('does not mount popup controls in an inactive application', () => {
  render(
    <PortalActiveContext value={false}>
      <ShadcnBaseSelectContent label="Hidden" empty>
        Hidden controls
      </ShadcnBaseSelectContent>
    </PortalActiveContext>,
  );
  expect(screen.queryByText('Hidden controls')).toBeNull();
});

it('keeps the popup in its isolated application portal host', async () => {
  const user = userEvent.setup();
  const host = document.createElement('div');
  document.body.appendChild(host);
  const view = render(
    <PortalHostContext value={host}>
      <ShadcnSelect
        label="Isolated"
        items={[{ value: 'a', label: 'Alpha' }]}
        value="a"
        onValueChange={vi.fn()}
      />
    </PortalHostContext>,
  );
  try {
    act(() => screen.getByRole('combobox').focus());
    await user.keyboard('{ArrowDown}');
    expect(within(host).getByRole('listbox')).toBeVisible();
  } finally {
    view.unmount();
    host.remove();
  }
});
