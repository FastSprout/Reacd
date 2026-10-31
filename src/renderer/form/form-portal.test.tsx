import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen } from '@testing-library/react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { expect, it, vi } from 'vitest';
import { AuthForm, Form, ReacdProvider } from '../../index.js';

function PortalFixture({ children, host }: { children: ReactNode; host: HTMLElement }) {
  return createPortal(children, host);
}

it('submits only a physically separate portal form', async () => {
  const outer = vi.fn();
  const inner = vi.fn();
  const host = document.createElement('div');
  document.body.append(host);
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Form label="Outer form" onSubmit={outer}>
        <PortalFixture host={host}>
          <AuthForm label="Portal auth" submitLabel="Submit portal" onSubmit={inner} />
        </PortalFixture>
      </Form>
    </ReacdProvider>,
  );
  const portal = await screen.findByRole('form', { name: 'Portal auth' });
  expect(screen.getByRole('form', { name: 'Outer form' }).contains(portal)).toBe(false);
  expect(screen.queryByRole('alert')).toBeNull();
  fireEvent.submit(portal);
  expect(inner).toHaveBeenCalledExactlyOnceWith();
  expect(outer).not.toHaveBeenCalled();
  view.unmount();
  host.remove();
});
