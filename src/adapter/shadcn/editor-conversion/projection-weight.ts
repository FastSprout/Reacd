import type { Node } from '@tiptap/pm/model';
import { z } from 'zod';
import {
  EDITOR_MARKS,
  EDITOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { CONTENT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { linkSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/link/link.schema.js';
import { stateKeySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/shared/definition.js';
import { editorTextChunks } from './text-chunks.js';

interface Weight {
  values: number;
  characters: number;
  extraDepth: number;
}
type Fields = Readonly<Record<string, string | number | null>>;
const markSchema = z.enum(EDITOR_MARKS);
const optionalId = stateKeySchema.nullish();

function attribute(node: Node, key: string): unknown {
  return node.attrs[key];
}
function textAttribute(node: Node, key: string): string {
  return z.string().parse(attribute(node, key));
}
function identity(node: Node): string {
  const parsed = optionalId.parse(attribute(node, 'reacdId'));
  return parsed ?? `${EDITOR_POLICY.blockIdPrefix}-${EDITOR_POLICY.maxBlocks}`;
}
function fieldsWeight(fields: Fields): Weight {
  const entries = Object.entries(fields);
  return {
    values: entries.length + 1,
    characters: entries.reduce(
      (size, [key, value]) =>
        size + key.length + (typeof value === 'string' ? value.length : 0),
      0,
    ),
    extraDepth: 1,
  };
}

export function sdkProjectionWeight(node: Node, inCode: boolean): Weight {
  const type = node.type.name;
  if (inCode) {
    if (type !== 'text') throw new Error('Invalid code child.');
    const text = z.string().max(EDITOR_POLICY.maxTextLength).parse(node.text);
    return { values: 0, characters: text.length, extraDepth: 0 };
  }
  switch (type) {
    case 'doc':
      return fieldsWeight({ version: EDITOR_POLICY.version, blocks: null });
    case 'paragraph':
      return fieldsWeight({ type, id: identity(node), content: null });
    case 'heading':
      return fieldsWeight({
        type,
        id: identity(node),
        content: null,
        level: z.number().parse(attribute(node, 'level')),
      });
    case 'blockquote':
      return fieldsWeight({ type: 'quote', id: identity(node), children: null });
    case 'bulletList':
      return fieldsWeight({ type, id: identity(node), items: null });
    case 'orderedList':
      return fieldsWeight({
        type,
        id: identity(node),
        items: null,
        start: z.number().parse(attribute(node, 'start')),
      });
    case 'listItem':
      return fieldsWeight({ type, id: identity(node), children: null });
    case 'horizontalRule':
      return fieldsWeight({ type: 'separator', id: identity(node) });
    case 'codeBlock': {
      const language = z.string().nullish().parse(attribute(node, 'language'));
      return fieldsWeight({
        type,
        id: identity(node),
        text: '',
        ...(language == null ? {} : { language }),
      });
    }
    case 'hardBreak':
      return fieldsWeight({ type });
    case 'reacdMention':
      return fieldsWeight({
        type: 'mention',
        id: textAttribute(node, 'id'),
        label: textAttribute(node, 'label'),
      });
    case 'reacdEmoji':
      return fieldsWeight({
        type: 'emoji',
        name: textAttribute(node, 'name'),
        value: textAttribute(node, 'value'),
      });
    case 'text': {
      const text = z.string().min(1).max(EDITOR_POLICY.maxCharacters).parse(node.text);
      const result = fieldsWeight({ type, text: '' });
      let marks = 0;
      for (const mark of node.marks) {
        if (mark.type.name === 'link') {
          const target: unknown = mark.attrs['href'];
          if (
            typeof target !== 'string' ||
            target.length > CONTENT_POLICY.maxLinkLength
          )
            throw new Error('Invalid editor link.');
          const href = linkSchema.shape.href.parse(target);
          result.values += 1;
          result.characters += 'link'.length + href.length;
        } else {
          const name = markSchema.parse(mark.type.name);
          marks += 1;
          result.values += 1;
          result.characters += name.length;
        }
      }
      if (marks > 0) {
        result.values += 1;
        result.characters += 'marks'.length;
        result.extraDepth = 2;
      }
      let chunks = 0;
      let characters = 0;
      for (const chunk of editorTextChunks(text)) {
        chunks += 1;
        characters += chunk.to - chunk.from;
      }
      result.values *= chunks;
      result.characters = result.characters * chunks + characters;
      return result;
    }
    default:
      throw new Error('Unsupported editor node.');
  }
}
