import { describe, expect, it } from 'vitest';
import { contentSurroundSchema } from './content-surround.schema.js';

const neighbor = { title: 'Reference', href: '/', description: 'Adjacent document.' };

describe('closed adjacent document declarations', () => {
  it('accepts absent neighbors and one or two explicit safe destinations', () => {
    for (const props of [
      {},
      { previous: neighbor },
      { next: neighbor },
      {
        previous: neighbor,
        next: { ...neighbor, newWindow: true },
        label: 'Related documents',
        emptyLabel: 'No adjacent reference.',
      },
    ])
      expect(contentSurroundSchema.safeParse(props).success).toBe(true);
  });

  it('rejects ambiguous native rendering and unsafe or unnamed targets', () => {
    for (const props of [
      { as: 'nav' },
      { style: {} },
      { label: ' ' },
      {
        next: { ...neighbor, href: 'javascript:alert(1)' },
      },
      { previous: { ...neighbor, title: '' } },
      {
        previous: { ...neighbor, onClick: () => undefined },
      },
    ])
      expect(contentSurroundSchema.safeParse(props).success).toBe(false);
  });
});
