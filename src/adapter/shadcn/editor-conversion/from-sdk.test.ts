import { getSchema } from '@tiptap/core';
import { expect, it } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { createEditorExtensions } from '../editor-sdk/extensions.js';
import { editorDocumentToSdk } from './to-sdk.js';
import { editorDocumentFromSdk } from './from-sdk.js';

it('round trips supported document content through the real SDK schema', () => {
  const document = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [
          {
            type: 'text',
            text: 'Emphasis',
            marks: ['bold', 'italic'],
            link: '/reference',
          },
          { type: 'hardBreak' },
          { type: 'mention', id: 'person', label: 'Example person' },
          { type: 'emoji', name: 'wave', value: '👋' },
        ],
      },
      { type: 'heading', id: 'title', level: 3, content: [] },
      { type: 'codeBlock', id: 'code', text: 'const n = 1;', language: 'typescript' },
      { type: 'codeBlock', id: 'plain', text: '' },
      {
        type: 'quote',
        id: 'quote',
        children: [{ type: 'paragraph', id: 'quoteText', content: [] }],
      },
      {
        type: 'orderedList',
        id: 'list',
        start: 4,
        items: [
          {
            type: 'listItem',
            id: 'item',
            children: [{ type: 'paragraph', id: 'itemText', content: [] }],
          },
        ],
      },
      {
        type: 'bulletList',
        id: 'bullets',
        items: [
          {
            type: 'listItem',
            id: 'bullet',
            children: [{ type: 'paragraph', id: 'bulletText', content: [] }],
          },
        ],
      },
      { type: 'separator', id: 'rule' },
    ],
  });
  const schema = getSchema(createEditorExtensions());
  const sdk = schema.nodeFromJSON(editorDocumentToSdk(document));
  expect(editorDocumentFromSdk(sdk)).toEqual({ success: true, data: document });
});

it('allocates ordered ids per document and rejects duplicate ids', () => {
  const schema = getSchema(createEditorExtensions());
  const empty = schema.node('paragraph');
  const sdk = schema.node('doc', null, [
    schema.node('paragraph', { reacdId: 'block-1' }),
    empty,
    empty,
  ]);
  const expected = {
    success: true,
    data: {
      version: 1,
      blocks: [
        { type: 'paragraph', id: 'block-1', content: [] },
        { type: 'paragraph', id: 'block-2', content: [] },
        { type: 'paragraph', id: 'block-3', content: [] },
      ],
    },
  };
  expect(editorDocumentFromSdk(sdk)).toEqual(expected);
  expect(editorDocumentFromSdk(sdk)).toEqual(expected);
  expect(
    editorDocumentFromSdk(
      schema.node('doc', null, [
        schema.node('paragraph', { reacdId: 'duplicate' }),
        schema.node('paragraph', { reacdId: 'duplicate' }),
      ]),
    ).success,
  ).toBe(false);
});

it('rejects unsupported or invalid native content before projection', () => {
  const schema = getSchema(createEditorExtensions());
  expect(editorDocumentFromSdk(schema.node('paragraph')).success).toBe(false);
  const invalid = schema.nodeFromJSON({
    type: 'doc',
    content: [{ type: 'text', text: 'Text cannot be a root block.' }],
  });
  expect(editorDocumentFromSdk(invalid).success).toBe(false);
  expect(
    editorDocumentFromSdk(
      schema.node('doc', null, [
        schema.node('codeBlock', { language: 'unsupported' }, [schema.text('Code')]),
      ]),
    ).success,
  ).toBe(false);
});

it('preserves valid long blocks when the SDK merges adjacent text nodes', () => {
  const document = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'long',
        content: [
          { type: 'text', text: 'a'.repeat(EDITOR_POLICY.maxTextLength) },
          { type: 'text', text: 'b' },
        ],
      },
    ],
  });
  const schema = getSchema(createEditorExtensions());
  const sdk = schema.nodeFromJSON(editorDocumentToSdk(document));
  expect(editorDocumentFromSdk(sdk)).toEqual({ success: true, data: document });
});
