import type { ChainedCommands } from '@tiptap/core';
import type {
  EditorCommand,
  EditorStandardCommand,
} from '@fastsprout/reacd/adapter-runtime/core/editor-commands.js';
import { EDITOR_HEADING_LEVELS } from
  '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';

const operations: Readonly<
  Record<EditorStandardCommand, (chain: ChainedCommands) => ChainedCommands>
> = {
  bold: (chain) => chain.toggleBold(),
  italic: (chain) => chain.toggleItalic(),
  strike: (chain) => chain.toggleStrike(),
  underline: (chain) => chain.toggleUnderline(),
  code: (chain) => chain.toggleCode(),
  heading1: (chain) => chain.toggleHeading({ level: EDITOR_HEADING_LEVELS[0] }),
  heading2: (chain) => chain.toggleHeading({ level: EDITOR_HEADING_LEVELS[1] }),
  heading3: (chain) => chain.toggleHeading({ level: EDITOR_HEADING_LEVELS[2] }),
  paragraph: (chain) => chain.setParagraph(),
  bulletList: (chain) => chain.toggleBulletList(),
  orderedList: (chain) => chain.toggleOrderedList(),
  quote: (chain) => chain.toggleBlockquote(),
  codeBlock: (chain) => chain.toggleCodeBlock(),
  separator: (chain) => chain.setHorizontalRule(),
  removeLink: (chain) => chain.unsetLink(),
  undo: (chain) => chain.undo(),
  redo: (chain) => chain.redo(),
};

export function editorCommandChain(
  chain: ChainedCommands,
  command: EditorCommand,
): ChainedCommands {
  return command.command === 'link'
    ? chain.setLink({ href: command.href })
    : operations[command.command](chain);
}
