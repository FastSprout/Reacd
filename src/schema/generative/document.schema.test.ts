import { describe, expect, it } from 'vitest';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { z } from 'zod';
import {
  documentSchema,
  limits,
  parseDocumentJson,
  SCHEMA_ID,
  validateDocument,
  visitNodes,
} from '../../index.js';
import type { ReacdNode } from '../../index.js';
import { createExample, scenarioSchema } from '../../../demo/example.js';
import { documentWith } from '../../../test-support/documents.js';

describe('closed DSL contract', () => {
  it.each(scenarioSchema.options)('accepts the complete %s example', (scenario) => {
    const document = createExample(scenario);
    expect(validateDocument(document)).toEqual({ success: true, data: document });
    expect(parseDocumentJson(JSON.stringify(document))).toEqual({
      success: true,
      data: document,
    });
  });

  it('accepts versioned schemas and preserves literal markup', () => {
    const document = {
      ...documentWith({ type: 'Text', content: '<script>alert(1)</script>' }),
      $schema: SCHEMA_ID,
    };
    expect(validateDocument(document)).toEqual({ success: true, data: document });
  });

  const invalidNodes: unknown[] = [
    { type: 'div', children: [] },
    { type: 'Text', content: 'x', className: 'fixed' },
    { type: 'Text', content: 'x', style: { color: 'red' } },
    { type: 'Text', content: 'x', html: '<b>x</b>' },
    { type: 'Text', content: 'x', dangerouslySetInnerHTML: { __html: 'x' } },
    { type: 'Text', content: 'x', role: 'arbitrary-css' },
    { type: 'Text', content: 'x', weight: '900' },
    { type: 'Text', content: 'x', lineLimit: 0 },
    { type: 'Text', content: 'x', lineLimit: 7 },
    { type: 'Text', content: 'x', lineLimit: 1.5 },
    { type: 'Text', content: 'x'.repeat(10_001) },
    { type: 'Grid', columns: 0, children: [] },
    { type: 'Grid', columns: 7, children: [] },
    { type: 'Grid', columns: 2.5, children: [] },
    { type: 'Grid', columns: '3', children: [] },
    { type: 'VStack', spacing: '12px', children: [] },
    { type: 'HStack' },
    {
      type: 'Card',
      children: Array.from({ length: 101 }, () => ({ type: 'Text', content: 'x' })),
    },
    { type: 'Button', label: 'Run' },
    { type: 'Button', label: '', action: 'run' },
    { type: 'Button', label: 'Run', action: 'javascript:alert(1)' },
    { type: 'Button', label: 'Run', action: 'run', onClick: 'run()' },
    { type: 'Button', label: 'Run', action: 'run', intent: 'blue' },
    { type: 'Input', id: 'name', label: '   ' },
    { type: 'Input', id: '__proto__', label: 'Name' },
    { type: 'Input', id: 'name', label: 'Name', inputType: 'file' },
    { type: 'Input', id: 'name', label: 'Name', value: 'x'.repeat(10_001) },
    { type: 'Table', caption: 'Data', columns: [], rows: [] },
    { type: 'Table', caption: 'Data', columns: ['One'], rows: [['a', 'b']] },
    { type: 'Table', caption: 'Data', columns: ['One'], rows: [[]] },
    {
      type: 'Table',
      caption: 'Data',
      columns: ['One'],
      rows: Array.from({ length: 201 }, () => ['a']),
    },
    {
      type: 'Table',
      caption: 'Data',
      columns: Array.from({ length: 13 }, () => 'One'),
      rows: [],
    },
    { type: 'Table', caption: 'Data', columns: ['One'], rows: [[12]] },
    { type: 'Table', caption: 'Data', columns: ['One'], rows: [], state: 'unknown' },
  ];
  it.each(invalidNodes.map((root, index) => ({ root, index })))(
    'rejects unsafe or invalid node $index',
    ({ root }) => {
      const result = validateDocument({
        schemaVersion: '0.1',
        templateId: 'saas-modern-light',
        root,
      });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.issues[0]?.path).toMatch(/^\$\.root/);
    },
  );

  it.each([
    null,
    [],
    {},
    {
      schemaVersion: '99',
      templateId: 'saas-modern-light',
      root: { type: 'Text', content: '' },
    },
    { ...documentWith({ type: 'Text', content: '' }), customCss: 'body{}' },
  ])('rejects an invalid document envelope: %j', (input) => {
    expect(validateDocument(input).success).toBe(false);
  });

  it('reports duplicate fields and inconsistent rows with exact paths', () => {
    const result = validateDocument(
      documentWith({
        type: 'VStack',
        children: [
          { type: 'Input', id: 'same', label: 'First' },
          { type: 'Input', id: 'same', label: 'Second' },
          { type: 'Table', caption: 'Data', columns: ['One'], rows: [['ok'], []] },
        ],
      }),
    );
    expect(result).toMatchObject({
      success: false,
      issues: [
        { path: '$.root.children[1].id' },
        { path: '$.root.children[2].rows[1]' },
      ],
    });
  });

  it('traverses all nodes in source order with stable paths', () => {
    const paths: string[] = [];
    visitNodes(
      {
        type: 'Card',
        children: [
          { type: 'Text', content: 'a' },
          { type: 'HStack', children: [] },
        ],
      },
      (node, path) => paths.push(`${path}:${node.type}`),
      'custom',
    );
    expect(paths).toEqual([
      'custom:Card',
      'custom.children[0]:Text',
      'custom.children[1]:HStack',
    ]);
  });

  it.each([undefined, () => 'code', Symbol('code'), 1n, Number.NaN, Infinity])(
    'rejects non-JSON values',
    (input) => {
      expect(validateDocument(input)).toMatchObject({
        success: false,
        issues: [{ message: 'Only JSON values are allowed.' }],
      });
    },
  );

  it('handles cycles and shared references without recursive overflow', () => {
    const cycle: Record<string, unknown> = {};
    cycle['self'] = cycle;
    const shared = { type: 'Text', content: 'x' };
    for (const input of [cycle, [shared, shared]]) {
      const result = validateDocument(input);
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.issues.map((issue) => issue.message).join()).toContain('cycles');
    }
  });

  it('limits depth, values, text, and keys before schema recursion', () => {
    let nested: unknown = null;
    for (let index = 0; index <= limits.depth; index += 1) nested = [nested];
    const tooMany = Array.from({ length: limits.values }, () => 1);
    const tooMuchText = ['x'.repeat(limits.characters), 'x'];
    const tooLargeKey = { ['x'.repeat(limits.characters + 1)]: false };
    for (const input of [nested, tooMany, tooMuchText, tooLargeKey]) {
      const result = validateDocument(input);
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.issues.map((issue) => issue.message).join()).toContain('budget');
    }
  });

  it('distinguishes malformed JSON from oversized source and invalid structure', () => {
    expect(parseDocumentJson('{')).toEqual({
      success: false,
      issues: [{ path: '$', message: 'Invalid JSON syntax.' }],
    });
    expect(parseDocumentJson(' '.repeat(limits.characters + 1))).toMatchObject({
      success: false,
      issues: [{ message: 'Document character budget exceeded.' }],
    });
    expect(parseDocumentJson('false').success).toBe(false);
  });

  it('accepts every layout and text modifier at its boundaries', () => {
    const nodes: ReacdNode[] = [
      { type: 'VStack', spacing: 'small', children: [] },
      { type: 'HStack', spacing: 'large', children: [] },
      { type: 'Grid', columns: 1, children: [] },
      { type: 'Grid', columns: 6, children: [] },
      ...(['normal', 'medium', 'bold'] as const).map((weight): ReacdNode => ({
        type: 'Text',
        content: '',
        weight,
        lineLimit: 6,
      })),
      {
        type: 'Input',
        id: 'constructor',
        label: 'Safe identifier',
        disabled: false,
        required: true,
        value: '',
      },
    ];
    for (const node of nodes)
      expect(validateDocument(documentWith(node)).success).toBe(true);
  });
});

describe('portable JSON Schema', () => {
  const validate = new Ajv2020({ strict: true }).compile(
    z.toJSONSchema(documentSchema, { target: 'draft-2020-12' }),
  );
  it.each(scenarioSchema.options)('validates %s independently from Zod', (scenario) => {
    expect(validate(createExample(scenario))).toBe(true);
  });
  it('rejects CSS nested deeply in a valid layout', () => {
    expect(
      validate({
        ...createExample('standard'),
        root: { type: 'Card', children: [{ type: 'Text', content: 'x', style: {} }] },
      }),
    ).toBe(false);
  });
  it('leaves relational invariants to the semantic validator', () => {
    const document = documentWith({
      type: 'Table',
      caption: 'Data',
      columns: ['A'],
      rows: [[]],
    });
    expect(validate(document)).toBe(true);
    expect(validateDocument(document).success).toBe(false);
  });
});
