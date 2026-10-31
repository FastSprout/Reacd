import type { Editor } from '@tiptap/core';
import type {
  EditorCommand,
  EditorStandardCommand,
} from '@fastsprout/reacd/adapter-runtime/core/editor-commands.js';
import { EDITOR_HEADING_LEVELS } from
  '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { linkSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/link/link.schema.js';
import { editorCommandChain } from './command-chain.js';

interface ActiveTarget {
  name: string;
  attributes?: Record<string, number>;
}
const activeTargets: Readonly<Partial<Record<EditorStandardCommand, ActiveTarget>>> = {
  bold: { name: 'bold' },
  italic: { name: 'italic' },
  strike: { name: 'strike' },
  underline: { name: 'underline' },
  code: { name: 'code' },
  heading1: { name: 'heading', attributes: { level: EDITOR_HEADING_LEVELS[0] } },
  heading2: { name: 'heading', attributes: { level: EDITOR_HEADING_LEVELS[1] } },
  heading3: { name: 'heading', attributes: { level: EDITOR_HEADING_LEVELS[2] } },
  paragraph: { name: 'paragraph' },
  bulletList: { name: 'bulletList' },
  orderedList: { name: 'orderedList' },
  quote: { name: 'blockquote' },
  codeBlock: { name: 'codeBlock' },
};

export function canRunSdkCommand(editor: Editor, command: EditorCommand): boolean {
  if (
    editor.isDestroyed ||
    (command.command === 'link' &&
      !linkSchema.shape.href.safeParse(command.href).success)
  )
    return false;
  return editorCommandChain(editor.can().chain(), command).run();
}
export function runSdkCommand(editor: Editor, command: EditorCommand): boolean {
  if (!canRunSdkCommand(editor, command)) return false;
  return editorCommandChain(editor.chain().focus(), command).run();
}
export function sdkCommandActive(editor: Editor, command: EditorCommand): boolean {
  if (editor.isDestroyed) return false;
  if (command.command === 'link')
    return editor.isActive('link', { href: command.href });
  const target = activeTargets[command.command];
  return target !== undefined && editor.isActive(target.name, target.attributes);
}
