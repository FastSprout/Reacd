import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { TOAST_POLICY } from '../../../core/toast-policy.js';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('bounds declarations and retries refused admission when room opens', async () => {
  const change = vi.fn();
  function Notices({ count = TOAST_POLICY.maximumQueued, open = true,
    active = true }: { count?: number; open?: boolean; active?: boolean }) {
    return <NativeToastSurface>
      {Array.from({ length: count }, (_, index) => <ShadcnToast key={index}
        title={`Notice ${index}`} open duration="persistent" onOpenChange={change} />)}
      <PortalActiveContext value={active}>
        <ShadcnToast title="Excess" open={open} onOpenChange={change} />
      </PortalActiveContext>
    </NativeToastSurface>;
  }
  const view = render(<Notices />);
  expect(screen.getAllByRole('dialog')).toHaveLength(TOAST_POLICY.maximumVisible);
  expect(screen.getByRole('alert', { name: 'Excess' }))
    .toHaveTextContent('queue is full');
  view.rerender(<Notices open={false} />);
  expect(screen.queryByRole('alert', { name: 'Excess' })).toBeNull();
  view.rerender(<Notices active={false} />);
  expect(screen.queryByRole('alert', { name: 'Excess' })).toBeNull();
  view.rerender(<Notices count={0} />);
  await waitFor(() => expect(screen.getByRole('dialog', { name: 'Excess' }))
    .toBeVisible());
  expect(change).not.toHaveBeenCalled();
});

it('isolates native providers and never evicts a focused earlier card', () => {
  const content = (extra: boolean) => <>
    <NativeToastSurface>
      {['First', 'Second', 'Third'].map(title => <ShadcnToast key={title}
        title={title} open duration="persistent" onOpenChange={() => undefined} />)}
      {extra && <ShadcnToast title="Fourth" open onOpenChange={() => undefined} />}
    </NativeToastSurface>
    <NativeToastSurface><ShadcnToast title="Independent" open
      duration="persistent" onOpenChange={() => undefined} /></NativeToastSurface>
  </>;
  const view = render(content(false));
  const first = screen.getByRole('dialog', { name: 'First' });
  first.focus();
  view.rerender(content(true));
  expect(screen.getAllByRole('dialog')).toHaveLength(4);
  expect(first).toHaveFocus();
  expect(screen.getByRole('dialog', { name: 'First' })).toBe(first);
  expect(screen.queryByRole('dialog', { name: 'Fourth' })).toBeNull();
  expect(screen.getByRole('dialog', { name: 'Independent' })).toBeVisible();
});
