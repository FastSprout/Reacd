import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnContextMenu } from './context-menu.adapter.js';

function Example({ disabled = false }: { disabled?: boolean }) {
  const [open, change] = useState(false);
  return (
    <ShadcnContextMenu
      label="Record"
      open={open}
      onOpenChange={change}
      disabled={disabled}
      items={[
        { type: 'action', key: 'run', label: 'Run', onPress: () => undefined },
      ]}
    >
      Record content
    </ShadcnContextMenu>
  );
}

it.each(['ContextMenu', 'Shift+F10'])(
  'opens through the supported native anchor for %s',
  async (key) => {
    const restore = installLayout(300);
    try {
      render(<Example />);
      const trigger = screen.getByRole('group', { name: 'Record' });
      trigger.focus();
      if (key === 'ContextMenu') fireEvent.keyDown(trigger, { key });
      else await userEvent.keyboard('{Shift>}{F10}{/Shift}');
      const menu = await screen.findByRole('menu', { name: 'Record' });
      await waitFor(() => {
        expect(menu.parentElement?.style.getPropertyValue('--anchor-width'))
          .toBe('300px');
      });
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      fireEvent.contextMenu(trigger, { clientX: 80, clientY: 100 });
      const pointerMenu = await screen.findByRole('menu', { name: 'Record' });
      await waitFor(() => {
        expect(pointerMenu.parentElement?.style.getPropertyValue('--anchor-width'))
          .toBe('0px');
      });
    } finally {
      restore();
    }
  },
);

it('ignores unrelated keys and disabled activation', () => {
  const change = vi.fn();
  const view = render(
    <ShadcnContextMenu label="Record" open={false} onOpenChange={change} items={[]}>
      Record
    </ShadcnContextMenu>,
  );
  const trigger = screen.getByRole('group', { name: 'Record' });
  expect(fireEvent.keyDown(trigger, { key: 'F10' })).toBe(true);
  expect(fireEvent.keyDown(trigger, { key: 'Enter', shiftKey: true })).toBe(true);
  view.rerender(<Example disabled />);
  expect(fireEvent.keyDown(screen.getByRole('group'), { key: 'ContextMenu' }))
    .toBe(true);
  expect(screen.queryByRole('menu')).toBeNull();
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <PortalActiveContext value={false}><Example /></PortalActiveContext>,
  );
  expect(fireEvent.keyDown(screen.getByRole('group'), { key: 'ContextMenu' }))
    .toBe(true);
  expect(screen.queryByRole('menu')).toBeNull();
});
