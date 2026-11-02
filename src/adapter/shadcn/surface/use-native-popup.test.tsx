import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativePopup } from './use-native-popup.js';
import { Button } from '../vendor/ui/button.js';
import { FormPendingContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';

function Probe() {
  const popup = useNativePopup();
  return <Button onClick={() => popup.onOpenChange(true)}>{String(popup.open)}</Button>;
}
it('closes transient native SDK state and rejects inactive reopening', async () => {
  const view = render(<Probe />);
  await userEvent.click(screen.getByRole('button', { name: 'false' }));
  expect(screen.getByRole('button', { name: 'true' })).toBeVisible();
  view.rerender(
    <PortalActiveContext.Provider value={false}>
      <Probe />
    </PortalActiveContext.Provider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'false' }));
  view.rerender(
    <PortalActiveContext.Provider value={true}>
      <Probe />
    </PortalActiveContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'false' })).toBeVisible();
});

it('closes native popup state while pending without reopening afterward', async () => {
  function Scope({ pending }: { pending: boolean }) {
    return <FormPendingContext value={pending}><Probe /></FormPendingContext>;
  }
  const view = render(<Scope pending={false} />);
  await userEvent.click(screen.getByRole('button', { name: 'false' }));
  expect(screen.getByRole('button', { name: 'true' })).toBeVisible();
  view.rerender(<Scope pending />);
  await userEvent.click(screen.getByRole('button', { name: 'false' }));
  view.rerender(<Scope pending={false} />);
  expect(screen.getByRole('button', { name: 'false' })).toBeVisible();
});
