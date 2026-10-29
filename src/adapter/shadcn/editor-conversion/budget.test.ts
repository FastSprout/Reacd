import { getSchema, Node as ExtensionNode } from '@tiptap/core';
import { expect, it, vi } from 'vitest';
import { CONTENT_POLICY } from '../../../core/policy.js';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { createEditorExtensions } from '../editor-sdk/extensions.js';
import { boundedSdkDocument } from './budget.js';

it('counts shared persistent SDK nodes by position without rejecting reuse', () => {
  const schema = getSchema(createEditorExtensions());
  const paragraph = schema.node('paragraph');
  const document = schema.node('doc', null, [paragraph, paragraph]);
  expect(boundedSdkDocument(document)).toBe(true);
  expect(boundedSdkDocument(paragraph)).toBe(false);
});

it('bounds child collections before visiting children or projecting DTO arrays', () => {
  const schema = getSchema(createEditorExtensions());
  const paragraph = schema.node('paragraph');
  const document = schema.node(
    'doc',
    null,
    Array.from({ length: EDITOR_POLICY.maxChildren + 1 }, () => paragraph),
  );
  const child = vi.spyOn(document, 'child');
  expect(boundedSdkDocument(document)).toBe(false);
  expect(child).not.toHaveBeenCalled();
  const huge = schema.node('doc', null, [
    schema.node('paragraph', null, [
      schema.text('x'.repeat(EDITOR_POLICY.maxCharacters + 1)),
    ]),
  ]);
  expect(boundedSdkDocument(huge)).toBe(false);
});

it('rejects deep trees, ancestry cycles and unsafe owned attributes', () => {
  const schema = getSchema(createEditorExtensions());
  let node = schema.node('paragraph');
  for (let depth = 0; depth < EDITOR_POLICY.maxDepth; depth += 1)
    node = schema.node('blockquote', null, [node]);
  expect(boundedSdkDocument(schema.node('doc', null, [node]))).toBe(false);
  const cyclic = schema.node('paragraph');
  Object.defineProperty(cyclic, 'childCount', { value: 1 });
  Object.defineProperty(cyclic, 'child', { value: () => cyclic });
  expect(boundedSdkDocument(schema.node('doc', null, [cyclic]))).toBe(false);
  const unsafe = schema.mark('link', { href: 'javascript:run()' });
  expect(
    boundedSdkDocument(
      schema.node('doc', null, [
        schema.node('paragraph', null, [schema.text('Unsafe link', [unsafe])]),
      ]),
    ),
  ).toBe(false);
  expect(
    boundedSdkDocument(
      schema.node('doc', null, [schema.node('paragraph', { reacdId: 'invalid id' })]),
    ),
  ).toBe(false);
});

it('rejects unsupported SDK nodes before they enter the closed model', () => {
  const unsupported = ExtensionNode.create({ name: 'unsupported', group: 'block' });
  const schema = getSchema([...createEditorExtensions(), unsupported]);
  const node = schema.node('unsupported');
  expect(boundedSdkDocument(schema.node('doc', null, [node]))).toBe(false);
});

it('bounds aggregate code text before concatenating it for the domain document', () => {
  const schema = getSchema(createEditorExtensions());
  const text = 'x'.repeat(EDITOR_POLICY.maxTextLength / 2 + 1);
  const document = schema.nodeFromJSON({
    type: 'doc',
    content: [
      {
        type: 'codeBlock',
        content: [
          { type: 'text', text },
          { type: 'text', text },
        ],
      },
    ],
  });
  expect(boundedSdkDocument(document)).toBe(false);
});

it('rejects malformed and oversized link attributes before URL parsing', () => {
  const schema = getSchema(createEditorExtensions());
  for (const href of [null, 'x'.repeat(CONTENT_POLICY.maxLinkLength + 1)]) {
    const mark = schema.mark('link', { href });
    const document = schema.node('doc', null, [
      schema.node('paragraph', null, [schema.text('Link', [mark])]),
    ]);
    expect(boundedSdkDocument(document)).toBe(false);
  }
});

it('rejects non-text code children before concatenation or DTO conversion', () => {
  const schema = getSchema(createEditorExtensions());
  const invalid = schema.nodeFromJSON({
    type: 'doc',
    content: [{ type: 'codeBlock', content: [{ type: 'hardBreak' }] }],
  });
  expect(boundedSdkDocument(invalid)).toBe(false);
});
