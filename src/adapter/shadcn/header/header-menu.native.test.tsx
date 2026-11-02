import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.props.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ShadcnHeaderMenu } from './header-menu.js';

type Mode = NonNullable<HeaderProps['menu']>['mode'];
const modes: Mode[] = [undefined, 'modal', 'slideover', 'drawer'];
function Example({ mode, active = true }: { mode: Mode; active?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <PortalActiveContext.Provider value={active}>
      <ShadcnHeaderMenu
        title="Navigation"
        menu={{
          open,
          onOpenChange: setOpen,
          mode,
          toggleLabel: 'Open documents',
          closeLabel: 'Close documents',
          content: 'Documents',
        }}
      />
    </PortalActiveContext.Provider>
  );
}

it.each(modes)('delegates controlled opening and closing to SDK %s', async (mode) => {
  const view = render(<Example mode={mode} />);
  fireEvent.click(screen.getByRole('button', { name: 'Open documents' }));
  if (mode === undefined || mode === 'modal')
    expect(screen.getByRole('dialog', { name: 'Navigation' }))
      .toHaveStyle({ gridTemplateColumns: 'minmax(0, 1fr)' });
  expect(
    screen.getByRole('dialog', { name: 'Navigation' }).getAttribute('data-slot'),
  ).toBe(mode === undefined || mode === 'modal' ? 'dialog-content' : 'sheet-content');
  fireEvent.click(screen.getByRole('button', { name: 'Close documents' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Open documents' }));
  view.rerender(<Example mode={mode} active={false} />);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('does not open a portal from an inactive header subtree', () => {
  const changed = vi.fn();
  render(
    <PortalActiveContext.Provider value={false}>
      <ShadcnHeaderMenu
        title="Navigation"
        menu={{ open: false, onOpenChange: changed, content: 'Documents' }}
      />
    </PortalActiveContext.Provider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(changed).not.toHaveBeenCalled();
});
