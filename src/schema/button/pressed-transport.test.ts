import { expect, it } from 'vitest';
import { documentSchema } from '../generative/document.schema.js';
import { generativeDocumentSchema } from '../generative-v2/document.schema.js';

it.each([true, false])('preserves pressed=%s in both JSON transports', (pressed) => {
  const root = { type: 'Button', label: 'Mono', action: 'mono', pressed };
  const legacy = documentSchema.parse({
    schemaVersion: '0.1', templateId: 'reacd', root,
  });
  const current = generativeDocumentSchema.parse({ schemaVersion: '0.2',
    state: [], root });
  expect(legacy.root).toEqual(root);
  expect(current.root).toEqual(root);
});

it('rejects nonboolean pressed data in both JSON transports', () => {
  for (const pressed of [null, 'true', 'mixed', 0]) {
    const root = { type: 'Button', label: 'Mono', action: 'mono', pressed };
    expect(documentSchema.safeParse({ schemaVersion: '0.1',
      templateId: 'reacd', root }).success).toBe(false);
    expect(generativeDocumentSchema.safeParse({ schemaVersion: '0.2',
      state: [], root }).success).toBe(false);
  }
});
