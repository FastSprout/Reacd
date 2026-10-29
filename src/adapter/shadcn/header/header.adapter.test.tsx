import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useContext, useEffect } from 'react';
import { atom, Provider, useAtom } from 'jotai';
import { userEvent } from '@testing-library/user-event';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { ShadcnHeaderMenu } from './header-menu.js';
import { ShadcnHeader } from './header.adapter.js';

const openAtom = atom(false);
function ControlledHeader() {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <ShadcnHeader
      title="Controlled"
      menu={{
        open,
        onOpenChange: setOpen,
        content: 'Destinations',
      }}
    />
  );
}

function NestedEscape({ dismiss }: { dismiss: () => void }) {
  const scope = useContext(EscapeScopeContext);
  useEffect(() => scope?.register(dismiss), [scope, dismiss]);
  return null;
}

describe('Header adapter', () => {
  it('restores toggle focus after keyboard dismissal', async () => {
    const user = userEvent.setup();
    render(
      <Provider>
        <ControlledHeader />
      </Provider>,
    );
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Controlled' })).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('gives nested escape layers priority over menu dismissal', async () => {
    const user = userEvent.setup();
    const dismiss = vi.fn();
    const change = vi.fn();
    render(
      <ShadcnHeaderMenu
        title="Nested"
        menu={{
          open: true,
          onOpenChange: change,
          content: <NestedEscape dismiss={dismiss} />,
        }}
      />,
    );
    await user.keyboard('{Escape}');
    expect(dismiss).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
  });
  it('renders all shell slots and a safe title link', () => {
    render(
      <ShadcnHeader
        title="reacd"
        href="/"
        start="Start"
        end="End"
        top="Top"
        bottom="Bottom"
      >
        Center
      </ShadcnHeader>,
    );
    expect(screen.getByRole('link', { name: 'reacd' })).toHaveAttribute('href', '/');
    for (const name of ['Start', 'End', 'Top', 'Bottom', 'Center']) {
      expect(screen.getByText(name)).toBeVisible();
    }
  });

  it('renders a plain title and closed controlled toggle', () => {
    const change = vi.fn();
    render(
      <ShadcnHeader
        title="Navigation"
        menu={{
          content: 'Menu body',
          open: false,
          onOpenChange: change,
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(change).toHaveBeenCalledWith(true);
  });

  it.each(['modal', 'slideover', 'drawer'] as const)(
    'renders and closes the %s menu',
    (mode) => {
      const change = vi.fn();
      render(
        <ShadcnHeader
          title="Navigation"
          menu={{
            content: 'Menu body',
            open: true,
            onOpenChange: change,
            mode,
            closeLabel: 'Dismiss',
            toggleLabel: 'Show menu',
          }}
        />,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('data-mode', mode);
      expect(screen.getByText('Menu body')).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(change).toHaveBeenCalledWith(false);
    },
  );
});
