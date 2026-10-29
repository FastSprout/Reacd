import { compileJsonSchema } from '../../../test-support/compile-json-schema.js';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GENERATIVE_EXAMPLE } from '../../../demo/generative/example.js';
import { validateGenerativeDocument } from './validate-document.js';

const schema: unknown = JSON.parse(
  readFileSync('schema/generative.schema.json', 'utf8'),
);
const validate = compileJsonSchema(schema);

describe('portable generative state schema', () => {
  it('preserves strict editorial calendar date validation', () => {
    for (const [date, valid] of [
      ['2024-02-29', true], ['2025-02-29', false], ['2024-13-01', false],
    ] as const) {
      const document = {
        schemaVersion: '0.2', state: [],
        root: { type: 'BlogPost', title: 'Calendar entry', date, children: [] },
      };
      expect(validate(document)).toBe(valid);
      expect(validateGenerativeDocument(document).success).toBe(valid);
    }
  });
  it('validates loading displays and every recursive empty-state slot', () => {
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'busy', kind: 'boolean', initial: true, access: 'read' }],
      root: {
        type: 'Empty',
        title: 'No records',
        loading: { state: 'busy', mode: 'read' },
        leading: [{ type: 'Avatar', name: 'Example reader' }],
        children: [{ type: 'Skeleton', show: { state: 'busy', mode: 'read' } }],
        actions: [{ type: 'Button', label: 'Refresh', action: 'refresh' }],
        footer: [{ type: 'Text', content: 'Local records' }],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(validate({ ...document, root: { ...document.root, style: {} } })).toBe(
      false,
    );
    expect(
      validate({
        ...document,
        root: {
          ...document.root,
          loading: { state: 'busy', mode: 'readWrite' },
        },
      }),
    ).toBe(false);
  });
  it('validates keyboard reads, popover writes, and nested footer data', () => {
    const document = {
      schemaVersion: '0.2',
      state: [
        { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
        { key: 'key', kind: 'text', initial: 'meta', access: 'read' },
      ],
      root: {
        type: 'Popover',
        title: 'Details',
        triggerLabel: 'Open details',
        open: { state: 'open', mode: 'readWrite' },
        children: [{ type: 'Kbd', value: { state: 'key', mode: 'read' } }],
        footer: [{ type: 'Text', content: 'Footer' }],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(validate({ ...document, root: { ...document.root, style: {} } })).toBe(
      false,
    );
    expect(
      validate({
        ...document,
        root: { ...document.root, open: { state: 'open', mode: 'read' } },
      }),
    ).toBe(false);
  });
  it('validates nested indicators and optional tooltip bindings', () => {
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'hint', kind: 'boolean', initial: false, access: 'readWrite' }],
      root: {
        type: 'Tooltip',
        text: 'Hint',
        open: { state: 'hint', mode: 'readWrite' },
        children: [
          {
            type: 'Chip',
            label: 'Unread',
            text: 8,
            children: [{ type: 'Text', content: 'Anchor' }],
          },
        ],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(validate({ ...document, root: { ...document.root, style: {} } })).toBe(
      false,
    );
    expect(
      validate({
        ...document,
        root: { ...document.root, open: { state: 'hint', mode: 'read' } },
      }),
    ).toBe(false);
  });
  it('validates avatars and rejects unsafe protocols and extra styles', () => {
    for (const root of [
      { type: 'Avatar', name: 'Example', src: '/avatar.png' },
      {
        type: 'AvatarGroup',
        label: 'Reviewers',
        items: [{ id: 'a', name: 'Example' }],
      },
    ]) {
      const document = { schemaVersion: '0.2', state: [], root };
      expect(validate(document)).toBe(true);
      expect(validateGenerativeDocument(document).success).toBe(true);
      expect(validate({ ...document, root: { ...root, style: {} } })).toBe(false);
    }
    expect(
      validate({
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Avatar', name: 'Example', src: 'javascript:alert(1)' },
      }),
    ).toBe(false);
  });
  it('validates choice groups while leaving membership to semantic validation', () => {
    for (const type of ['RadioGroup', 'CheckboxGroup']) {
      const document = {
        schemaVersion: '0.2',
        state: [
          {
            key: 'value',
            kind: type === 'RadioGroup' ? 'text' : 'selection',
            initial: type === 'RadioGroup' ? '' : [],
            access: 'readWrite',
          },
        ],
        root: {
          type,
          label: 'Choices',
          items: [{ value: 'a', label: 'A' }],
          value: { state: 'value', mode: 'readWrite' },
        },
      };
      expect(validate(document)).toBe(true);
      expect(validateGenerativeDocument(document).success).toBe(true);
      expect(
        validate({
          ...document,
          root: { ...document.root, value: { state: 'value', mode: 'read' } },
        }),
      ).toBe(false);
    }
  });
  it('validates Collapsible content and writable open bindings', () => {
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'open', kind: 'boolean', initial: false, access: 'readWrite' }],
      root: {
        type: 'Collapsible',
        label: 'Example',
        open: { state: 'open', mode: 'readWrite' },
        children: [{ type: 'Text', content: 'Nested body' }],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(
      validate({
        ...document,
        root: {
          ...document.root,
          open: { state: 'open', mode: 'read' },
        },
      }),
    ).toBe(false);
  });
  it('validates Modal boolean bindings and recursive footer content', () => {
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'open', kind: 'boolean', initial: false, access: 'readWrite' }],
      root: {
        type: 'Modal',
        title: 'Example',
        description: 'Local example',
        open: { state: 'open', mode: 'readWrite' },
        children: [{ type: 'Text', content: 'Body' }],
        footer: [{ type: 'Button', label: 'Apply', action: 'apply' }],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(validate({ ...document, root: { ...document.root, style: {} } })).toBe(
      false,
    );
  });
  it('validates recursive Accordion content and selection bindings', () => {
    const document = {
      schemaVersion: '0.2',
      state: [{ key: 'open', kind: 'selection', initial: [], access: 'readWrite' }],
      root: {
        type: 'Accordion',
        label: 'Sections',
        value: { state: 'open', mode: 'readWrite' },
        items: [
          {
            value: 'one',
            label: 'One',
            content: {
              type: 'VStack',
              children: [{ type: 'Text', content: 'Nested body' }],
            },
          },
        ],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(
      validate({
        ...document,
        root: { ...document.root, value: { state: 'open', mode: 'read' } },
      }),
    ).toBe(false);
  });
  it('validates the complete stateful example independently of the renderer', () => {
    expect(validate(GENERATIVE_EXAMPLE)).toBe(true);
  });

  it('rejects undeclared styling and malformed state values', () => {
    expect(
      validate({
        ...GENERATIVE_EXAMPLE,
        state: [
          { key: 'amount', kind: 'number', access: 'readWrite', initial: 'wrong type' },
        ],
      }),
    ).toBe(false);
    expect(
      validate({
        ...GENERATIVE_EXAMPLE,
        root: {
          type: 'Text',
          content: 'Escape',
          style: { color: 'red' },
        },
      }),
    ).toBe(false);
  });

  it('requires semantic validation for relational state references', () => {
    const document = {
      ...GENERATIVE_EXAMPLE,
      root: { type: 'Text', content: { state: 'missing', mode: 'read' } },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(false);
  });
});
