import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeNodeView } from './node-view.js';
import { carouselSchema } from '../../schema/carousel/index.js';
import { marqueeSchema } from '../../schema/marquee/index.js';
import { buttonComponentSchema } from '../../schema/button/button.schema.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'slide', kind: 'number', initial: 0, access: 'readWrite' },
    { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
  ],
  root: {
    type: 'Carousel',
    label: 'Generated slides',
    value: { state: 'slide', mode: 'readWrite' },
    retryAction: 'retry',
    items: [
      {
        id: 'first',
        label: 'First',
        children: [{ type: 'Text', content: 'First content' }],
      },
      {
        id: 'second',
        label: 'Second',
        children: [
          { type: 'Button', label: 'Nested action', action: 'run' },
          {
            type: 'Marquee',
            label: 'Generated notices',
            paused: { state: 'paused', mode: 'readWrite' },
            items: [{ id: 'notice', label: 'Notice' }],
          },
        ],
      },
    ],
  },
});

it('reports the exact unsupported native Carousel transport boundary', () => {
  expectUnsupportedExample(<GenerativeUI adapter={shadcnAdapter}
    document={document} actions={{ run: vi.fn(), retry: vi.fn() }} />, 'Carousel');
});

it('walks recursive declarations and retains inactive child state contracts', () => {
  const registry = createDocumentState(document);
  const probe = exampleDeclarationProbe();
  const run = vi.fn();
  const retry = vi.fn();
  render(<probe.Surface>
    <GenerativeNodeView node={document.root} registry={registry}
      actions={{ run, retry }} />
  </probe.Surface>);
  expect(probe.texts()).toContain('First content');
  expect(registry.update('slide', 2).success).toBe(false);
  act(() => { probe.read('Carousel', carouselSchema).onValueChange(1); });
  expect(success(registry.read('slide')).value).toBe(1);
  act(() => {
    probe.read('Button', buttonComponentSchema, 'Nested action').onPress();
  });
  expect(run).toHaveBeenCalledWith({ state: registry });
  act(() => { probe.read('Marquee', marqueeSchema).onPausedChange(false); });
  expect(success(registry.read('paused')).value).toBe(false);
  act(() => { registry.update('slide', 0); });
  expect(probe.read('Carousel', carouselSchema).value).toBe(0);
  expect(probe.texts()).toContain('First content');
});

it('validates actions and bindings even in initially inactive slides', () => {
  const view = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={document}
      actions={{ retry: vi.fn() }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: run');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={document}
      actions={{ run: vi.fn() }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: retry');
  expect(
    validateGenerativeDocument({
      ...document,
      state: [{ key: 'slide', kind: 'number', initial: 0, access: 'readWrite' }],
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...document,
      state: [
        { key: 'slide', kind: 'number', initial: 2, access: 'readWrite' },
        { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
      ],
    }).success,
  ).toBe(false);
});
