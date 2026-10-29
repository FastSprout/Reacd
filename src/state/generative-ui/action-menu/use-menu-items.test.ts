import { defineGenerativeDeclaration } from '../../../schema/generative-v2/index.js';
import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { menuNodeItemsSchema } from '../../../schema/action-menu/generative.schema.js';
import { createDocumentState } from '../create-document-state.js';
import { useMenuItems } from './use-menu-items.js';
const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'mode', kind: 'text', access: 'readWrite', initial: 'one' }],
  root: { type: 'Text', content: 'Record' },
});
const items = menuNodeItemsSchema.parse([
  {
    type: 'radio',
    key: 'mode',
    label: 'Mode',
    value: {
      state: 'mode',
      mode: 'readWrite',
    },
    options: [{ value: 'one', label: 'One' }],
  },
]);
it('validates missing snapshots and invalid writes through its live lease', () => {
  const registry = { ...createDocumentState(document) };
  const constrain = vi.spyOn(registry, 'constrain');
  const actions = {};
  const report = vi.fn();
  renderHook(() => useMenuItems(items, registry, actions, report));
  const validate = constrain.mock.calls[0]?.[1];
  if (validate === undefined) throw new Error('Constraint was not registered.');
  const failure = {
    success: false as const,
    issues: [{ path: '$', message: 'Snapshot missing.' }],
  };
  expect(validate(() => failure)).toBe(failure);
  expect(
    validate(() => ({
      success: true,
      data: {
        key: 'mode',
        kind: 'text',
        value: 'absent',
      },
    })).success,
  ).toBe(false);
});
it('reports failed constraint registration', () => {
  const registry = { ...createDocumentState(document) };
  const failure = {
    success: false as const,
    issues: [{ path: '$', message: 'Lease registration failed.' }],
  };
  vi.spyOn(registry, 'constrain').mockReturnValue(failure);
  const actions = {};
  const report = vi.fn();
  const view = renderHook(() => useMenuItems(items, registry, actions, report));
  expect(view.result.current).toEqual(failure);
});
