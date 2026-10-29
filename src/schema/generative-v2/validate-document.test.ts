import { describe, expect, it } from 'vitest';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import {
  parseGenerativeJson,
  validateGenerativeDocument,
} from './validate-document.js';
import type { GenerativeDeclaration, GenerativeNode } from './document.schema.js';

function declaration(root: GenerativeNode): GenerativeDeclaration {
  return {
    schemaVersion: '0.2',
    state: [
      { key: 'name', kind: 'text', initial: 'Initial', access: 'readWrite' },
      { key: 'amount', kind: 'number', initial: 50, access: 'readWrite' },
      { key: 'enabled', kind: 'boolean', initial: false, access: 'readWrite' },
    ],
    root,
  };
}

describe('version 0.2 generative declarations', () => {
  it('validates shared, typed readers and writers across all implemented nodes', () => {
    const document = declaration({
      type: 'VStack',
      children: [
        {
          type: 'HStack',
          children: [
            { type: 'Card', children: [{ type: 'Text', content: 'Literal' }] },
          ],
        },
        {
          type: 'Grid',
          columns: 2,
          children: [
            {
              type: 'Input',
              label: 'Name',
              value: { state: 'name', mode: 'readWrite' },
            },
            { type: 'Text', content: { state: 'name', mode: 'read' } },
            { type: 'Text', content: { state: 'enabled', mode: 'read' } },
            {
              type: 'Checkbox',
              label: 'Enabled',
              checked: { state: 'enabled', mode: 'readWrite' },
            },
            {
              type: 'Toggle',
              label: 'Updates',
              checked: { state: 'enabled', mode: 'readWrite' },
            },
            {
              type: 'Slider',
              label: 'Amount',
              min: 0,
              max: 100,
              value: { state: 'amount', mode: 'readWrite' },
            },
            {
              type: 'Progress',
              label: 'Completion',
              value: { state: 'amount', mode: 'read' },
            },
            { type: 'Progress', label: 'Fixed progress', value: 10 },
            { type: 'Button', label: 'Save', action: 'save' },
            { type: 'Table', caption: 'Example', columns: ['Value'], rows: [['A']] },
          ],
        },
      ],
    });
    const result = parseGenerativeJson(JSON.stringify(document));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(document);
  });

  it.each([
    { type: 'Text', content: { state: 'missing', mode: 'read' } },
    { type: 'Input', label: 'Name', value: { state: 'amount', mode: 'readWrite' } },
    { type: 'Text', content: { state: 'name', mode: 'readWrite' } },
    {
      type: 'Slider',
      label: 'Amount',
      min: 0,
      max: 10,
      value: { state: 'amount', mode: 'readWrite' },
    },
    {
      type: 'Slider',
      label: 'Amount',
      min: 100,
      max: 0,
      value: { state: 'amount', mode: 'readWrite' },
    },
    { type: 'Table', caption: 'Example', columns: ['Value'], rows: [[]] },
    { type: 'div', children: [] },
    { type: 'Text', content: 'Styled', className: 'escape' },
  ])('rejects invalid nodes and binding contracts: %o', (root) => {
    const document = declaration({ type: 'Text', content: 'Initial' });
    expect(validateGenerativeDocument({ ...document, root }).success).toBe(false);
  });

  it('rejects component writes to read-only state', () => {
    const document = declaration({
      type: 'Input',
      label: 'Name',
      value: { state: 'name', mode: 'readWrite' },
    });
    expect(
      validateGenerativeDocument({
        ...document,
        state: [{ key: 'name', kind: 'text', initial: '', access: 'read' }],
      }).success,
    ).toBe(false);
  });

  it('rejects invalid JSON, excessive budgets, and mismatched versions', () => {
    expect(parseGenerativeJson('{').success).toBe(false);
    expect(
      parseGenerativeJson(' '.repeat(DOCUMENT_POLICY.maxCharacters + 1)).success,
    ).toBe(false);
    const cyclic: unknown[] = [];
    cyclic.push(cyclic);
    expect(validateGenerativeDocument(cyclic).success).toBe(false);
    expect(validateGenerativeDocument({ schemaVersion: '0.1' }).success).toBe(false);
  });
});
