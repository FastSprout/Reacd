import { expect, it } from 'vitest';
import { defineGenerativeDeclaration } from './define-declaration.js';

it('defines validated declarations and rejects invalid semantic references', () => {
  expect(
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [],
      root: { type: 'Text', content: 'Valid' },
    }).root,
  ).toEqual({ type: 'Text', content: 'Valid' });
  expect(() =>
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [],
      root: { type: 'Text', content: { state: 'missing', mode: 'read' } },
    }),
  ).toThrow('State key is not registered.');
});
