import { z } from 'zod';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { expect, it } from 'vitest';
import { treeNodeSchema } from './generative.schema.js';

it('exports a structural recursive schema for independent validation', () => {
  const schema = z.toJSONSchema(treeNodeSchema, { target: 'draft-2020-12' });
  const validate = new Ajv2020({ strict: false }).compile(schema);
  const node = {
    type: 'Tree',
    label: 'Files',
    items: [
      { id: 'folder', label: 'Folder', children: [{ id: 'file', label: 'File' }] },
    ],
    value: { state: 'selected', mode: 'readWrite' },
    expanded: { state: 'expanded', mode: 'read' },
  };
  expect(validate(node)).toBe(true);
  expect(validate({ ...node, className: 'native' })).toBe(false);
  expect(validate({ ...node, items: [{ id: 'file', label: '' }] })).toBe(false);
  expect(
    validate({
      ...node,
      items: [
        {
          id: 'folder',
          label: 'Folder',
          children: [{ id: 'child', label: 'Child', html: 'native' }],
        },
      ],
    }),
  ).toBe(false);
});
