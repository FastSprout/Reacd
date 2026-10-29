import { compileJsonSchema } from '../../../test-support/compile-json-schema.js';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateGenerativeDocument } from './validate-document.js';

const schema: unknown = JSON.parse(
  readFileSync('schema/generative.schema.json', 'utf8'),
);
const validate = compileJsonSchema(schema);

describe('portable navigation contract', () => {
  it('preserves paging state, safe URL metadata and breadcrumb actions', () => {
    const document = {
      schemaVersion: '0.2',
      state: [
        {
          key: 'page',
          kind: 'pagination',
          access: 'readWrite',
          initial: { pageIndex: 0, pageSize: 10 },
        },
      ],
      root: {
        type: 'VStack',
        children: [
          {
            type: 'Pagination',
            label: 'Pages',
            totalItems: 100,
            value: { state: 'page', mode: 'readWrite' },
            navigation: { href: '/orders?status=open#results' },
          },
          {
            type: 'Breadcrumb',
            label: 'Path',
            items: [
              { key: 'home', label: 'Home', href: '/' },
              { key: 'refresh', label: 'Refresh', action: 'refresh' },
            ],
          },
        ],
      },
    };
    expect(validate(document)).toBe(true);
    expect(validateGenerativeDocument(document).success).toBe(true);
    expect(
      validate({
        ...document,
        root: {
          type: 'Pagination',
          label: 'Unsafe',
          totalItems: 100,
          value: { state: 'page', mode: 'read' },
          navigation: { href: 'javascript:alert(1)' },
        },
      }),
    ).toBe(false);
    expect(
      validate({
        ...document,
        root: {
          type: 'Breadcrumb',
          label: 'Unsafe',
          style: {},
          items: [{ key: 'home', label: 'Home' }],
        },
      }),
    ).toBe(false);
  });
});
