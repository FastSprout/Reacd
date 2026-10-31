import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CONTENT_POLICY } from '../../core/policy.js';
import { selectionValueSchema } from '../../schema/state/selection/selection.schema.js';
import { rowIdSchema } from '../../schema/state/shared/definition.js';
import { ReacdProvider } from '../provider/provider.js';
import { BoundTree } from '../generative-ui/bound-tree.js';
import { BoundInputTags } from '../generative-ui/bound-input-tags.js';
import { success, tableFixture } from '../../../test-support/data-table.js';
import { createStateRegistry } from './state-registry.js';

const LONG_KEY = 'k'.repeat(CONTENT_POLICY.maxLabelLength);

it('accepts option-capacity keys and rejects over-budget writes atomically', () => {
  expect(selectionValueSchema.safeParse([LONG_KEY]).success).toBe(true);
  expect(selectionValueSchema.safeParse([`${LONG_KEY}x`]).success).toBe(false);
  expect(selectionValueSchema.safeParse(['']).success).toBe(false);
  expect(selectionValueSchema.safeParse(['same', 'same']).success).toBe(false);
  const registry = success(
    createStateRegistry([
      { key: 'selected', kind: 'selection', initial: [LONG_KEY], access: 'readWrite' },
    ]),
  );
  expect(registry.update('selected', [`${LONG_KEY}x`]).success).toBe(false);
  expect(success(registry.read('selected')).value).toEqual([LONG_KEY]);
  expect(registry.update('selected', ['next']).success).toBe(true);
  expect(registry.reset().success).toBe(true);
  expect(success(registry.read('selected')).value).toEqual([LONG_KEY]);
});

it('preserves DataTable row-id and connected known-selection constraints', () => {
  expect(rowIdSchema.safeParse(LONG_KEY).success).toBe(false);
  const { registry, controller } = tableFixture();
  const disconnect = success(controller.connect());
  try {
    expect(registry.update('orders.selection', [LONG_KEY]).success).toBe(false);
    expect(controller.select([LONG_KEY]).success).toBe(false);
    expect(success(controller.read()).selection).toEqual([]);
  } finally {
    disconnect();
  }
});

it('preserves bound Tree known-id and InputTags domain limits', () => {
  const registry = success(
    createStateRegistry([
      { key: 'tree', kind: 'selection', initial: ['leaf'], access: 'readWrite' },
      { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
      { key: 'tags', kind: 'selection', initial: ['small'], access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundTree
        registry={registry}
        node={{
          type: 'Tree',
          label: 'Tree',
          items: [{ id: 'leaf', label: 'Leaf' }],
          value: { state: 'tree', mode: 'readWrite' },
          expanded: { state: 'expanded', mode: 'readWrite' },
        }}
      />
      <BoundInputTags
        registry={registry}
        node={{
          type: 'InputTags',
          label: 'Tags',
          maxTagLength: 5,
          value: { state: 'tags', mode: 'readWrite' },
        }}
      />
    </ReacdProvider>,
  );
  act(() => {
    expect(registry.update('tree', [LONG_KEY]).success).toBe(false);
    expect(registry.update('tree', ['missing']).success).toBe(false);
    expect(registry.update('expanded', ['leaf']).success).toBe(false);
    expect(registry.update('tags', [LONG_KEY]).success).toBe(false);
    expect(registry.update('tags', ['sixsix']).success).toBe(false);
  });
  expect(success(registry.read('tree')).value).toEqual(['leaf']);
  expect(success(registry.read('tags')).value).toEqual(['small']);
});
