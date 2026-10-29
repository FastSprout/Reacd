import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider, Text } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import type { CarouselNode } from '../../schema/carousel/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { CarouselNodeView } from './carousel-node-view.js';
const node: CarouselNode<GenerativeNode> = {
  type: 'Carousel',
  label: 'Bound slides',
  value: { state: 'index', mode: 'readWrite' },
  items: [
    { id: 'one', label: 'First', children: [{ type: 'Text', content: 'First' }] },
    { id: 'two', label: 'Second', children: [{ type: 'Text', content: 'Second' }] },
  ],
};
const child = () => <Text>Rendered slide content</Text>;
it('shares bounded indexes and preserves explicit reader access', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'index', kind: 'number', initial: 0, access: 'readWrite' },
    ]),
  );
  const view = render(
    <ReacdProvider>
      <CarouselNodeView
        node={node}
        registry={registry}
        actions={{}}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(success(registry.read('index')).value).toBe(1);
  act(() => {
    expect(registry.update('index', 2).success).toBe(false);
  });
  view.rerender(
    <ReacdProvider>
      <CarouselNodeView
        node={{ ...node, value: { state: 'index', mode: 'read' } }}
        registry={registry}
        actions={{}}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
  view.rerender(
    <ReacdProvider>
      <CarouselNodeView
        node={{ ...node, readOnly: true }}
        registry={registry}
        actions={{}}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
});
it('guards stale retry handlers and reports unavailable state', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'index', kind: 'number', initial: 0, access: 'readWrite' },
    ]),
  );
  const retry = vi.fn();
  const view = render(
    <ReacdProvider>
      <CarouselNodeView
        node={{ ...node, state: 'error', retryAction: 'retry' }}
        registry={registry}
        actions={{ retry }}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry slides' }));
  expect(retry).toHaveBeenCalledWith({ state: registry });
  view.rerender(
    <ReacdProvider>
      <CarouselNodeView
        node={{ ...node, state: 'error', retryAction: 'retry' }}
        registry={registry}
        actions={{}}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry slides' }));
  expect(retry).toHaveBeenCalledOnce();
  view.rerender(
    <ReacdProvider>
      <CarouselNodeView
        node={node}
        registry={success(createStateRegistry([]))}
        actions={{}}
        renderChild={child}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('index');
});
