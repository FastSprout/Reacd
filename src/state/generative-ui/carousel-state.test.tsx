import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Text } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { carouselSchema } from '../../schema/carousel/index.js';
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
function state() {
  return success(createStateRegistry([
    { key: 'index', kind: 'number', initial: 0, access: 'readWrite' },
  ]));
}
it('reports the exact unsupported native Carousel boundary', () => {
  expectUnsupportedExample(<CarouselNodeView node={node} registry={state()}
    actions={{}} renderChild={child} />, 'Carousel');
});
it('shares bounded indexes and preserves explicit reader access', () => {
  const probe = exampleDeclarationProbe();
  const registry = state();
  const view = render(<probe.Surface>
    <CarouselNodeView node={node} registry={registry} actions={{}}
      renderChild={child} />
  </probe.Surface>);
  act(() => { probe.read('Carousel', carouselSchema).onValueChange(1); });
  expect(success(registry.read('index')).value).toBe(1);
  act(() => { expect(registry.update('index', 2).success).toBe(false); });
  view.rerender(<probe.Surface>
    <CarouselNodeView node={{ ...node, value: { state: 'index', mode: 'read' } }}
      registry={registry} actions={{}} renderChild={child} />
  </probe.Surface>);
  expect(probe.read('Carousel', carouselSchema).readOnly).toBe(true);
  act(() => { probe.read('Carousel', carouselSchema).onValueChange(0); });
  expect(success(registry.read('index')).value).toBe(1);
  view.rerender(<probe.Surface>
    <CarouselNodeView node={{ ...node, readOnly: true }} registry={registry}
      actions={{}} renderChild={child} />
  </probe.Surface>);
  expect(probe.read('Carousel', carouselSchema).readOnly).toBe(true);
  expect(probe.read('Carousel', carouselSchema).value).toBe(1);
  view.unmount();
  expect(registry.update('index', 2).success).toBe(true);
});
it('guards removed retry handlers and reports unavailable state', () => {
  const probe = exampleDeclarationProbe();
  const registry = state();
  const retry = vi.fn();
  const view = render(<probe.Surface>
    <CarouselNodeView node={{ ...node, state: 'error', retryAction: 'retry' }}
      registry={registry} actions={{ retry }} renderChild={child} />
  </probe.Surface>);
  expect(probe.read('Carousel', carouselSchema).onRetry).toBeTypeOf('function');
  act(() => { probe.read('Carousel', carouselSchema).onRetry?.(); });
  expect(retry).toHaveBeenCalledWith({ state: registry });
  view.rerender(<probe.Surface>
    <CarouselNodeView node={{ ...node, state: 'error', retryAction: 'retry' }}
      registry={registry} actions={{}} renderChild={child} />
  </probe.Surface>);
  expect(probe.read('Carousel', carouselSchema).onRetry).toBeTypeOf('function');
  act(() => { probe.read('Carousel', carouselSchema).onRetry?.(); });
  expect(retry).toHaveBeenCalledOnce();
  view.rerender(<probe.Surface>
    <CarouselNodeView node={node} registry={success(createStateRegistry([]))}
      actions={{}} renderChild={child} />
  </probe.Surface>);
  expect(screen.getByRole('alert')).toHaveTextContent('index');
});
