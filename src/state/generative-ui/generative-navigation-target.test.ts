import { expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { generativeNavigationTarget } from './generative-navigation-target.js';

it('never falls back to an inherited host action after deletion', () => {
  const registry = createDocumentState(
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [],
      root: { type: 'VStack', children: [] },
    }),
  );
  const own = vi.fn();
  const inherited = vi.fn();
  const actions: Record<string, () => void> = { run: own };
  const target = generativeNavigationTarget(
    {
      key: 'run',
      label: 'Run',
      action: 'run',
    },
    registry,
    actions,
  );
  target.onPress?.();
  expect(own).toHaveBeenCalledOnce();
  delete actions['run'];
  Object.setPrototypeOf(actions, { run: inherited });
  target.onPress?.();
  expect(inherited).not.toHaveBeenCalled();
  expect(own).toHaveBeenCalledOnce();
});
