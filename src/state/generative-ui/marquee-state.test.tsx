import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { marqueeNodeSchema } from '../../schema/marquee/index.js';
import { BoundMarquee } from './bound-marquee.js';
const node = marqueeNodeSchema.parse({
  type: 'Marquee',
  label: 'Notices',
  items: [{ id: 'one', label: 'Notice' }],
  paused: { state: 'paused', mode: 'readWrite' },
});
it('writes pause state and keeps readonly bindings static', async () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
    ]),
  );
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundMarquee node={node} registry={registry} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Resume movement' }));
  expect(success(registry.read('paused')).value).toBe(false);
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundMarquee
        node={{ ...node, paused: { state: 'paused', mode: 'read' } }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('list', { name: 'Notices' })).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundMarquee node={{ ...node, readOnly: true }} registry={registry} />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('button')).toBeNull();
  vi.unstubAllGlobals();
});
it('rejects missing or mistyped shared pause state', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundMarquee node={node} registry={success(createStateRegistry([]))} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('paused');
});
