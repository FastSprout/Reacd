import { expect, it } from 'vitest';
import { editorSuggestionMenuSchema } from './editor-suggestion-menu.schema.js';

it('allows only labelled unique supported block operations and closed props', () => {
  expect(
    editorSuggestionMenuSchema.safeParse({
      label: 'Insert',
      items: [{ command: 'heading1', label: 'Heading' }],
    }).success,
  ).toBe(true);
  for (const items of [
    [{ command: 'undo', label: 'Undo' }],
    [
      { command: 'paragraph', label: 'One' },
      { command: 'paragraph', label: 'Two' },
    ],
    [{ command: 'paragraph', label: 'Text', onSelect: () => undefined }],
  ])
    expect(
      editorSuggestionMenuSchema.safeParse({ label: 'Insert', items }).success,
    ).toBe(false);
  expect(
    editorSuggestionMenuSchema.safeParse({
      label: 'Insert',
      items: [],
      className: 'unsafe',
    }).success,
  ).toBe(false);
});
