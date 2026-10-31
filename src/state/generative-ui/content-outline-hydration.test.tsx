import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { contentNavigationNodeSchema } from
  '../../schema/content-navigation/generative.schema.js';
import { contentTocNodeSchema } from '../../schema/content-toc/generative.schema.js';
import { createStateRegistry } from '../registry/state-registry.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundContentNavigation } from './bound-content-navigation.js';
import { BoundContentToc } from './bound-content-toc.js';

vi.mock('../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

const navigation = contentNavigationNodeSchema.parse({
  type: 'ContentNavigation',
  label: 'Hydrated documents',
  items: [
    {
      key: 'guide',
      label: 'Guide',
      children: [{ key: 'intro', label: 'Introduction', href: '/intro' }],
    },
  ],
  currentKey: { state: 'current', mode: 'readWrite' },
  expandedKeys: { state: 'expanded', mode: 'readWrite' },
});
const toc = contentTocNodeSchema.parse({
  type: 'ContentToc',
  label: 'Hydrated headings',
  items: [{ key: 'intro', label: 'Introduction heading' }],
  currentKey: { state: 'current', mode: 'readWrite' },
});

function registry() {
  const result = createStateRegistry([
    { key: 'current', kind: 'text', initial: '', access: 'readWrite' },
    { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
  ]);
  if (!result.success) throw new Error('Invalid hydration fixture.');
  return result.data;
}

function Scene({ state }: { state: StateRegistry }) {
  return (
    <ReacdProvider adapter={shadcnAdapter} store={state.store}>
      <BoundContentNavigation registry={state} node={navigation} />
      <BoundContentToc registry={state} node={toc} />
    </ReacdProvider>
  );
}

it('hydrates IDs and isolates outline state between SSR requests', async () => {
  const user = userEvent.setup();
  const server = registry();
  const client = registry();
  const errors = vi.fn();
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Scene state={server} />);
  document.body.append(container);
  const originalId = container.querySelector('button')?.getAttribute('aria-controls');
  expect(originalId).toBeTruthy();
  let root: Root | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, <Scene state={client} />, {
        onRecoverableError: errors,
      });
    });
    expect(screen.getByRole('button', { name: 'Expand Guide' })).toHaveAttribute(
      'aria-controls',
      originalId,
    );
    await user.click(screen.getByRole('button', { name: 'Expand Guide' }));
    await user.click(screen.getByRole('link', { name: 'Introduction' }));
    expect(client.read('expanded')).toMatchObject({ data: { value: ['guide'] } });
    expect(client.read('current')).toMatchObject({ data: { value: 'intro' } });
    expect(server.read('expanded')).toMatchObject({ data: { value: [] } });
    expect(server.read('current')).toMatchObject({ data: { value: '' } });
    const nextRequest = registry();
    const nextMarkup = renderToString(<Scene state={nextRequest} />);
    expect(nextMarkup).toContain('aria-expanded="false"');
    expect(nextMarkup).not.toContain('aria-current="location"');
    expect(errors).not.toHaveBeenCalled();
  } finally {
    await act(async () => {
      root?.unmount();
    });
    container.remove();
  }
});
