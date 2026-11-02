import { Prose } from '@fastsprout/reacd';
import type { ProseDocument } from '@fastsprout/reacd';

const content: ProseDocument = [
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Write content once. ' },
      { type: 'strong', children: [{ type: 'text', text: 'Keep your design.' }] },
    ],
  },
];

export function ProseExample() {
  return <Prose document={content} />;
}
