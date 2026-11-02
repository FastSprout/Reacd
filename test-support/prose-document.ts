import { HEADING_LEVELS } from '../src/core/heading-policy.js';
import type { ProseDocument, ProseInline } from '../src/core/prose.js';

const text = (value: string): ProseInline => ({ type: 'text', text: value });
export const PROSE_DOCUMENT: ProseDocument = [
  ...HEADING_LEVELS.map((level) => ({
    type: 'heading' as const,
    level,
    id: `heading-${level}`,
    children: [text(`Heading ${level}`)],
  })),
  {
    type: 'paragraph',
    children: [
      text('Paragraph '),
      { type: 'strong', children: [text('strong')] },
      text(' '),
      { type: 'emphasis', children: [text('emphasis')] },
      text(' '),
      { type: 'delete', children: [text('deleted')] },
      text(' '),
      { type: 'code', text: 'inline code' },
      text(' '),
      { type: 'link', href: '../guide/', children: [text('Guide')] },
      { type: 'break' },
      text('<script>unsafe()</script>'),
    ],
  },
  {
    type: 'quote',
    children: [{ type: 'paragraph', children: [text('Quoted paragraph')] }],
  },
  {
    type: 'list',
    ordered: true,
    start: 3,
    items: [
      {
        checked: true,
        children: [{ type: 'paragraph', children: [text('Complete')] }],
      },
      {
        checked: false,
        children: [{ type: 'paragraph', children: [text('Pending')] }],
      },
    ],
  },
  {
    type: 'list',
    ordered: false,
    items: [{ children: [{ type: 'paragraph', children: [text('Unordered item')] }] }],
  },
  {
    type: 'code',
    language: 'tsx',
    content: 'const value = 1;\n',
    tokens: [
      [
        { text: 'const ', light: '#000000', dark: '#ffffff' },
        { text: 'value = 1;', light: '#234567', dark: '#abcdef' },
      ],
      [],
    ],
  },
  { type: 'code', language: '', content: 'plain();' },
  {
    type: 'table',
    header: [[text('Name')], [text('Status')]],
    rows: [[[text('Project')], [text('Active')]]],
  },
  { type: 'thematicBreak' },
  { type: 'image', src: '/project.svg', alt: 'Project diagram', title: 'Diagram' },
];
