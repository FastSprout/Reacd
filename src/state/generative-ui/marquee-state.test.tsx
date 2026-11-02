import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { marqueeNodeSchema, marqueeSchema } from '../../schema/marquee/index.js';
import { BoundMarquee } from './bound-marquee.js';
const node = marqueeNodeSchema.parse({
  type: 'Marquee', label: 'Notices', items: [{ id: 'one', label: 'Notice' }],
  paused: { state: 'paused', mode: 'readWrite' },
});
function state() {
  return success(createStateRegistry([
    { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
  ]));
}
it('reports the exact unsupported native Marquee boundary', () => {
  expectUnsupportedExample(<BoundMarquee node={node} registry={state()} />,
    'Marquee');
});
it('writes pause state and protects readers while forwarding readonly metadata', () => {
  const probe = exampleDeclarationProbe();
  const registry = state();
  const view = render(<probe.Surface>
    <BoundMarquee node={node} registry={registry} />
  </probe.Surface>);
  act(() => { probe.read('Marquee', marqueeSchema).onPausedChange(false); });
  expect(success(registry.read('paused')).value).toBe(false);
  view.rerender(<probe.Surface>
    <BoundMarquee node={{ ...node, paused: { state: 'paused', mode: 'read' } }}
      registry={registry} />
  </probe.Surface>);
  expect(probe.read('Marquee', marqueeSchema).readOnly).toBe(true);
  act(() => { probe.read('Marquee', marqueeSchema).onPausedChange(true); });
  expect(success(registry.read('paused')).value).toBe(false);
  view.rerender(<probe.Surface>
    <BoundMarquee node={{ ...node, readOnly: true }} registry={registry} />
  </probe.Surface>);
  expect(probe.read('Marquee', marqueeSchema).readOnly).toBe(true);
  expect(probe.read('Marquee', marqueeSchema).paused).toBe(false);
});
it('rejects missing or mistyped shared pause state', () => {
  const probe = exampleDeclarationProbe();
  for (const definitions of [[], [
    { key: 'paused', kind: 'text', initial: 'true', access: 'readWrite' },
  ]]) {
    const view = render(<probe.Surface>
      <BoundMarquee node={node} registry={success(createStateRegistry(definitions))} />
    </probe.Surface>);
    expect(screen.getByRole('alert')).toHaveTextContent('paused');
    view.unmount();
  }
});
