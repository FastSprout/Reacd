import { z } from 'zod';
import {
  EDITOR_DEFAULTS,
  EDITOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { stateKeySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/shared/definition.js';
import { labelSchema } from '@fastsprout/reacd/adapter-runtime/schema/shared/values.js';

const mentionSchema = z.strictObject({ id: stateKeySchema, label: labelSchema });
const emojiSchema = z.strictObject({
  name: stateKeySchema,
  value: z.string().min(1).max(EDITOR_POLICY.maxEmojiLength),
});

export type EditorAtomKind = 'mention' | 'emoji';
interface EditorAtomData {
  text: string;
  attributes: Record<string, string>;
}

export function editorAtomData(
  kind: EditorAtomKind,
  attributes: unknown,
): EditorAtomData {
  if (kind === 'mention') {
    const parsed = mentionSchema.safeParse(attributes);
    if (parsed.success)
      return {
        text: `${EDITOR_DEFAULTS.mentionPrefix}${parsed.data.label}`,
        attributes: {
          class: 'reacd-editor-mention',
          contenteditable: 'false',
          'data-reacd-mention': parsed.data.id,
        },
      };
  } else {
    const parsed = emojiSchema.safeParse(attributes);
    if (parsed.success)
      return {
        text: parsed.data.value,
        attributes: {
          class: 'reacd-editor-emoji',
          contenteditable: 'false',
          role: 'img',
          'aria-label': parsed.data.name,
          'data-reacd-emoji': parsed.data.name,
        },
      };
  }
  return {
    text: EDITOR_DEFAULTS.unavailableInline,
    attributes: { contenteditable: 'false' },
  };
}
