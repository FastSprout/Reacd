import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useContext, useEffect, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, Text, Input, ReacdProvider, App } from '../../../index.js';
import type { SidebarProps } from '../../../components/sidebar/index.js';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

function Scene(properties: Partial<SidebarProps>) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [value, setValue] = useState('Retained state');
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <App direction="rtl">
        <Sidebar
          title="Workspace"
          open={open}
          onOpenChange={setOpen}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
          {...properties}
        >
          <Input label="Workspace query" value={value} onValueChange={setValue} />
        </Sidebar>
        <Text>Outside navigation</Text>
      </App>
    </ReacdProvider>
  );
}

function EscapeLayer({ dismiss }: { dismiss: () => void }) {
  const scope = useContext(EscapeScopeContext);
  const [active, setActive] = useState(true);
  useEffect(
    () =>
      active
        ? scope?.register(() => {
            dismiss();
            setActive(false);
          })
        : undefined,
    [active, scope, dismiss],
  );
  return <Text>Nested escape layer</Text>;
}

describe('Sidebar desktop and mobile behavior', () => {
  it('retains one child tree through collapse and reflow', async () => {
    const user = userEvent.setup();
    render(<Scene />);
    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeVisible();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(
      screen.getByRole('complementary').closest('.reacd-sidebar-shell'),
    ).not.toBeNull();
    expect(document.body).not.toHaveAttribute('inert');
    const query = screen.getByRole('textbox', { name: 'Workspace query' });
    await user.clear(query);
    await user.type(query, 'Changed');
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(query).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.getByRole('textbox', { name: 'Workspace query' })).toBe(query);
    resizeContainers(320);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    const dialog = await screen.findByRole('dialog', { name: 'Workspace' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('data-direction', 'rtl');
    expect(screen.getByRole('textbox', { name: 'Workspace query' })).toBe(query);
    expect(query).toHaveValue('Changed');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: 'Toggle navigation',
        }),
      ).toHaveFocus(),
    );
    resizeContainers(1024);
    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeVisible();
  });

  it('keeps icon content accessible while hiding retained full content', async () => {
    const user = userEvent.setup();
    render(
      <Scene
        collapsible="icon"
        collapsedContent={<Text>Short label</Text>}
        side="end"
        variant="floating"
        header={<Text>Header content</Text>}
        actions={<Text>Header actions</Text>}
        footer={<Text>Footer content</Text>}
      />,
    );
    expect(screen.getByText('Header content')).toBeVisible();
    expect(screen.getByText('Footer content')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.getByText('Short label')).toBeVisible();
    expect(screen.getByRole('complementary').className).toBe('reacd-sidebar-collapsed');
  });

  it('never hides a noncollapsible region or exposes a dead toggle', () => {
    render(<Scene collapsible="none" open={false} variant="inset" />);
    resizeContainers(240);
    expect(screen.getByRole('complementary')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Toggle navigation' })).toBeNull();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(screen.getByRole('complementary')).toBeVisible();
  });

  it('dismisses nested escape layers before closing the mobile sidebar', async () => {
    const user = userEvent.setup();
    const dismiss = vi.fn();
    render(<Scene header={<EscapeLayer dismiss={dismiss} />} />);
    resizeContainers(320);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    await user.keyboard('{Escape}');
    expect(dismiss).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog')).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('honors host rejection and disabled toggles', async () => {
    const user = userEvent.setup();
    const desktop = vi.fn();
    const mobile = vi.fn();
    const view = render(<Scene onOpenChange={desktop} onMobileOpenChange={mobile} />);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(desktop).toHaveBeenCalledWith(false);
    expect(screen.getByRole('complementary')).toBeVisible();
    resizeContainers(320);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(mobile).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).toBeNull();
    view.rerender(<Scene disabled />);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
