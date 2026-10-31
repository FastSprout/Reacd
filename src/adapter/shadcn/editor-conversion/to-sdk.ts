import type { JSONContent } from '@tiptap/core';
import type {
  EditorBlock,
  EditorDocument,
  EditorInline,
  EditorListItem,
} from '@fastsprout/reacd/adapter-runtime/core/editor-document.js';

function inlineToSdk(inline: EditorInline): JSONContent {
  if (inline.type === 'hardBreak') return { type: 'hardBreak' };
  if (inline.type === 'mention')
    return { type: 'reacdMention', attrs: { id: inline.id, label: inline.label } };
  if (inline.type === 'emoji')
    return { type: 'reacdEmoji', attrs: { name: inline.name, value: inline.value } };
  const marks: NonNullable<JSONContent['marks']> = (inline.marks ?? []).map((mark) => ({
    type: mark,
  }));
  if (inline.link !== undefined)
    marks.push({ type: 'link', attrs: { href: inline.link } });
  return { type: 'text', text: inline.text, ...(marks.length === 0 ? {} : { marks }) };
}

function itemToSdk(item: EditorListItem): JSONContent {
  return {
    type: 'listItem',
    attrs: { reacdId: item.id },
    content: item.children.map(blockToSdk),
  };
}

function blockToSdk(block: EditorBlock): JSONContent {
  const attrs = { reacdId: block.id };
  switch (block.type) {
    case 'paragraph':
      return { type: 'paragraph', attrs, content: block.content.map(inlineToSdk) };
    case 'heading':
      return {
        type: 'heading',
        attrs: { ...attrs, level: block.level },
        content: block.content.map(inlineToSdk),
      };
    case 'quote':
      return { type: 'blockquote', attrs, content: block.children.map(blockToSdk) };
    case 'codeBlock':
      return {
        type: 'codeBlock',
        attrs: {
          ...attrs,
          ...(block.language === undefined ? {} : { language: block.language }),
        },
        content: block.text.length === 0 ? [] : [{ type: 'text', text: block.text }],
      };
    case 'bulletList':
      return { type: 'bulletList', attrs, content: block.items.map(itemToSdk) };
    case 'orderedList':
      return {
        type: 'orderedList',
        attrs: { ...attrs, start: block.start },
        content: block.items.map(itemToSdk),
      };
    case 'separator':
      return { type: 'horizontalRule', attrs };
  }
}

export function editorDocumentToSdk(document: EditorDocument): JSONContent {
  return { type: 'doc', content: document.blocks.map(blockToSdk) };
}
