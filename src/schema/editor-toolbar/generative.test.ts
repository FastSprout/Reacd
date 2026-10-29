import { expect, it } from 'vitest';
import { editorToolbarNodeSchema } from './generative.schema.js';

it('transports only closed literal commands and safe links', () => {
  const value = editorToolbarNodeSchema.parse({
    type: 'EditorToolbar',
    label: 'Formatting',
    disabled: false,
    items: [
      { command: 'bold', label: 'Emphasize' },
      { command: 'link', href: 'https://reacd.dev/', disabled: true },
    ],
  });
  expect(Object.isFrozen(value)).toBe(true);
  expect(Object.isFrozen(value.items)).toBe(true);
  expect(editorToolbarNodeSchema.safeParse({ type: 'EditorToolbar' }).success).toBe(
    true,
  );
  for (const extra of [
    { items: [] },
    { items: [{ command: 'bold' }, { command: 'bold' }] },
    { items: [{ command: 'html' }] },
    { items: [{ command: 'bold', action: 'execute' }] },
    { items: [{ command: 'link', href: 'javascript:alert(1)' }] },
    { items: { state: 'commands', mode: 'read' } },
    { disabled: { state: 'flag', mode: 'read' } },
    { children: [] },
    { onCommand() {} },
    { className: 'escape' },
  ])
    expect(
      editorToolbarNodeSchema.safeParse({ type: 'EditorToolbar', ...extra }).success,
    ).toBe(false);
});
