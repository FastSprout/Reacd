import type { Node } from '@tiptap/pm/model';
import { z } from 'zod';
import { EDITOR_MARKS } from '../../../core/editor-policy.js';
import { sdkAttribute } from './attribute.js';
import { editorTextChunks } from './text-chunks.js';

const inlineType = z.enum(['text', 'hardBreak', 'reacdMention', 'reacdEmoji']);
const markType = z.enum([...EDITOR_MARKS, 'link']);
const projectors = {
  text(node: Node): unknown[] {
    const marks: string[] = [];
    let link: unknown;
    for (const mark of node.marks) {
      const type = markType.parse(mark.type.name);
      if (type === 'link') link = sdkAttribute(mark, 'href');
      else marks.push(type);
    }
    const text = z.string().parse(node.text);
    return [...editorTextChunks(text)].map(({ from, to }) => ({
      type: 'text',
      text: text.slice(from, to),
      ...(marks.length === 0 ? {} : { marks: [...marks] }),
      ...(link === undefined ? {} : { link }),
    }));
  },
  hardBreak(): unknown[] {
    return [{ type: 'hardBreak' }];
  },
  reacdMention(node: Node): unknown[] {
    return [
      {
        type: 'mention',
        id: sdkAttribute(node, 'id'),
        label: sdkAttribute(node, 'label'),
      },
    ];
  },
  reacdEmoji(node: Node): unknown[] {
    return [
      {
        type: 'emoji',
        name: sdkAttribute(node, 'name'),
        value: sdkAttribute(node, 'value'),
      },
    ];
  },
};

export function inlineFromSdk(node: Node): unknown[] {
  return projectors[inlineType.parse(node.type.name)](node);
}

export function inlineContentFromSdk(node: Node): unknown[] {
  const content: unknown[] = [];
  node.forEach((child) => {
    content.push(...inlineFromSdk(child));
  });
  return content;
}
