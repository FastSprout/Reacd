import { expect, it } from 'vitest';
import { success } from '../../../test-support/data-table.js';
import { validateGenerativeDocument } from './validate-document.js';
import { visitGenerativeNodes } from './document.schema.js';

const state = [
  {
    key: 'notes',
    kind: 'richDocument',
    access: 'readWrite',
    initial: { version: 1, blocks: [{ type: 'paragraph', id: 'intro', content: [] }] },
  },
];
const root = {
  type: 'Editor',
  label: 'Notes',
  value: { state: 'notes', mode: 'readWrite' },
};

it('visits optional editor slots and accepts their absence', () => {
  const bare = success(
    validateGenerativeDocument({ schemaVersion: '0.2', state, root }),
  );
  const barePaths: string[] = [];
  visitGenerativeNodes(bare.root, (node, path) =>
    barePaths.push(`${path}:${node.type}`),
  );
  expect(barePaths).toEqual(['$.root:Editor']);
  const nested = success(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state,
      root: {
        ...root,
        toolbar: [{ type: 'EditorToolbar', items: [{ command: 'bold' }] }],
        children: [{ type: 'Text', content: 'Safe help' }],
      },
    }),
  );
  const paths: string[] = [];
  visitGenerativeNodes(nested.root, (node, path) => paths.push(`${path}:${node.type}`));
  expect(paths).toEqual([
    '$.root:Editor',
    '$.root.toolbar[0]:EditorToolbar',
    '$.root.children[0]:Text',
  ]);
});

it('rejects unresolved state inside either recursive editor slot', () => {
  for (const slot of ['toolbar', 'children']) {
    const result = validateGenerativeDocument({
      schemaVersion: '0.2',
      state,
      root: {
        ...root,
        [slot]: [
          {
            type: 'Text',
            content: { state: 'missing', mode: 'read' },
          },
        ],
      },
    });
    expect(result.success).toBe(false);
    if (result.success) throw new Error('Expected an unresolved state reference.');
    expect(result.issues).toContainEqual({
      path: `$.root.${slot}[0].content`,
      message: 'State key is not registered.',
    });
  }
});
