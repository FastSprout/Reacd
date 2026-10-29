import { getSchema } from '@tiptap/core';
import { expect, it } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { success } from '../../../../test-support/data-table.js';
import { editorDocumentFromSdk } from '../editor-conversion/from-sdk.js';
import { createEditorExtensions } from './extensions.js';
import { buildEditorPlainPaste } from './plain-paste.js';

it('preserves literal text and empty lines while normalizing line endings', () => {
  expect(success(buildEditorPlainPaste(''))).toEqual([]);
  expect(success(buildEditorPlainPaste('', 'code'))).toEqual([]);
  const fragment = success(buildEditorPlainPaste('<img src=x>\r\n\rEnd\n'));
  expect(fragment).toEqual([
    { type: 'text', text: '<img src=x>' },
    { type: 'hardBreak' },
    { type: 'hardBreak' },
    { type: 'text', text: 'End' },
    { type: 'hardBreak' },
  ]);
  const schema = getSchema(createEditorExtensions());
  const native = schema.nodeFromJSON({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { reacdId: 'intro' },
        content: fragment,
      },
    ],
  });
  expect(success(editorDocumentFromSdk(native)).blocks).toEqual([
    {
      type: 'paragraph',
      id: 'intro',
      content: fragment,
    },
  ]);
});

it('preserves surrogate pairs and exact metadata budgets', () => {
  const prefix = 'a'.repeat(EDITOR_POLICY.maxTextLength - 1);
  const chunks = success(buildEditorPlainPaste(prefix + '😀x'));
  expect(chunks).toEqual([
    { type: 'text', text: prefix },
    { type: 'text', text: '😀x' },
  ]);
  const twoTextMetadata = 'typetexttext'.length * 2;
  const limit = EDITOR_POLICY.maxCharacters - twoTextMetadata;
  const exact = success(buildEditorPlainPaste('x'.repeat(limit)));
  expect(exact.map((node) => node.text).join('')).toHaveLength(limit);
  expect(buildEditorPlainPaste('x'.repeat(limit + 1)).success).toBe(false);
});

it('bounds line and combined inline allocation before publishing any fragment', () => {
  expect(
    success(buildEditorPlainPaste('\n'.repeat(EDITOR_POLICY.maxInlines))),
  ).toHaveLength(EDITOR_POLICY.maxInlines);
  expect(buildEditorPlainPaste('\n'.repeat(EDITOR_POLICY.maxInlines + 1)).success).toBe(
    false,
  );
  const breaks = '\n'.repeat(EDITOR_POLICY.maxInlines - 1);
  expect(success(buildEditorPlainPaste('x' + breaks))).toHaveLength(
    EDITOR_POLICY.maxInlines,
  );
  expect(buildEditorPlainPaste('x' + breaks + 'x').success).toBe(false);
  const alternating = '\n' + 'x\n'.repeat(EDITOR_POLICY.maxInlines / 2);
  expect(buildEditorPlainPaste(alternating).success).toBe(false);
  expect(
    buildEditorPlainPaste('x'.repeat(EDITOR_POLICY.maxCharacters + 1)).success,
  ).toBe(false);
});

it('keeps code newlines as text and rejects unsupported code lengths', () => {
  const fragment = success(buildEditorPlainPaste('const n = 1;\r\n<n>\r', 'code'));
  expect(fragment).toEqual([{ type: 'text', text: 'const n = 1;\n<n>\n' }]);
  const schema = getSchema(createEditorExtensions());
  const native = schema.nodeFromJSON({
    type: 'doc',
    content: [
      {
        type: 'codeBlock',
        attrs: { reacdId: 'code' },
        content: fragment,
      },
    ],
  });
  expect(success(editorDocumentFromSdk(native)).blocks).toEqual([
    {
      type: 'codeBlock',
      id: 'code',
      text: 'const n = 1;\n<n>\n',
    },
  ]);
  const exact = 'x'.repeat(EDITOR_POLICY.maxTextLength);
  expect(success(buildEditorPlainPaste(exact, 'code'))[0]?.text).toBe(exact);
  const invalid = buildEditorPlainPaste(exact + 'x', 'code');
  expect(invalid.success).toBe(false);
  if (!invalid.success) expect(invalid.issues[0]?.message).not.toContain(exact);
});
