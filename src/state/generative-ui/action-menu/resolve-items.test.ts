import { defineGenerativeDeclaration } from '../../../schema/generative-v2/index.js';
import { atom } from 'jotai';
import { expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createDocumentState } from '../create-document-state.js';
import { menuNodeItemsSchema } from '../../../schema/action-menu/generative.schema.js';
import { menuChoice, resolveMenuItems } from './resolve-items.js';
const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'flag', kind: 'boolean', access: 'readWrite', initial: false },
    { key: 'mode', kind: 'text', access: 'readWrite', initial: 'one' },
  ],
  root: { type: 'Text', content: 'Record' },
});
it('rejects missing bindings and invalid current choice values', () => {
  const registry = createDocumentState(document);
  const report = vi.fn();
  const get = <Value>(target: import('jotai').Atom<Value>) =>
    registry.store.get(target);
  expect(
    menuChoice({ state: 'missing', mode: 'read' }, z.boolean(), registry, get, report)
      .success,
  ).toBe(false);
  expect(
    menuChoice({ state: 'mode', mode: 'read' }, z.boolean(), registry, get, report)
      .success,
  ).toBe(false);
  const readonly = menuChoice(
    { state: 'flag', mode: 'read' },
    z.boolean(),
    registry,
    get,
    report,
  );
  if (!readonly.success) throw new Error('Invalid fixture.');
  expect(readonly.data.readOnly).toBe(true);
  expect(readonly.data.change(true)).toBe(false);
  expect(report).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({ message: 'This binding is read-only.' }),
    ]),
  );
  for (const items of [
    [
      {
        type: 'radio',
        key: 'bad',
        label: 'Bad',
        value: { state: 'flag', mode: 'read' },
        options: [{ value: 'one', label: 'One' }],
      },
    ],
    [
      {
        type: 'submenu',
        key: 'sub',
        label: 'Sub',
        items: [
          {
            type: 'checkbox',
            key: 'bad',
            label: 'Bad',
            checked: {
              state: 'missing',
              mode: 'read',
            },
          },
        ],
      },
    ],
  ]) {
    const parsed = menuNodeItemsSchema.parse(items);
    expect(resolveMenuItems(parsed, registry, {}, get, report).success).toBe(false);
  }
});
it('rechecks own callable action handlers', () => {
  const registry = createDocumentState(document);
  const run = vi.fn();
  const inherited = vi.fn();
  const actions: Record<string, () => void> = { run };
  const items = menuNodeItemsSchema.parse([
    { type: 'action', key: 'run', label: 'Run', action: 'run' },
  ]);
  const model = registry.store.get(
    atom((get) => resolveMenuItems(items, registry, actions, get, vi.fn())),
  );
  if (!model.success) throw new Error('Invalid fixture.');
  const item = model.data[0];
  if (item?.type !== 'action') throw new Error('Missing action fixture.');
  item.onPress();
  expect(run).toHaveBeenCalledOnce();
  Object.setPrototypeOf(actions, { run: inherited });
  delete actions['run'];
  item.onPress();
  expect(inherited).not.toHaveBeenCalled();
  Object.defineProperty(actions, 'run', { value: 'invalid', configurable: true });
  expect(() => item.onPress()).not.toThrow();
});
