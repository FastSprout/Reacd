import { createElement } from 'react';
import { expect, it } from 'vitest';
import { editorSchema } from './editor.schema.js';
import { editorToolbarSchema } from '../editor-toolbar/editor-toolbar.schema.js';

const value = { version: 1, blocks: [{ type: 'paragraph', id: 'intro', content: [] }] };
const properties = { label: 'Document', value, onValueChange: () => undefined };

it('separates private selection from atomic controlled editing', () => {
  expect(editorSchema.safeParse(properties).success).toBe(true);
  const selection = {
    anchor: { blockId: 'intro', offset: 0 },
    focus: { blockId: 'intro', offset: 0 },
  };
  const controlled = {
    label: 'Document',
    value,
    selection,
    onEditChange: () => undefined,
  };
  expect(editorSchema.safeParse(controlled).success).toBe(true);
  for (const candidate of [
    { ...properties, selection },
    { ...controlled, onValueChange: () => undefined },
    { ...controlled, onSelectionChange: () => undefined },
    { ...properties, onEditChange: () => undefined },
    {
      ...controlled,
      selection: { ...selection, focus: { blockId: 'missing', offset: 0 } },
    },
  ])
    expect(editorSchema.safeParse(candidate).success).toBe(false);
});

it('rejects native authoring, unsafe slots, callbacks and SDK surfaces', () => {
  for (const extra of [
    { style: { color: 'red' } },
    { className: 'custom' },
    { html: '<div>' },
    { extensions: [] },
    { editor: {} },
    { render: () => null },
    { onInput: () => undefined },
    { onChange: () => undefined },
    { toolbar: createElement('div') },
    { children: createElement('p') },
    { onValueChange: null },
  ])
    expect(editorSchema.safeParse({ ...properties, ...extra }).success).toBe(false);
});

it('keeps toolbar commands closed and link data validated', () => {
  expect(
    editorToolbarSchema.safeParse({
      label: 'Formatting',
      items: [
        { command: 'bold' },
        { command: 'link', href: '/reference', label: 'Link reference' },
      ],
    }).success,
  ).toBe(true);
  for (const items of [
    [{ command: 'bold' }, { command: 'bold' }],
    [{ command: 'link', href: 'javascript:run()' }],
    [{ command: 'link' }],
    [{ command: 'customHtml' }],
    [{ command: 'bold', onPress: () => undefined }],
  ])
    expect(editorToolbarSchema.safeParse({ items }).success).toBe(false);
  expect(editorToolbarSchema.safeParse({ style: {} }).success).toBe(false);
});
