import StarterKit from '@tiptap/starter-kit';
import { EDITOR_BEHAVIOR, EDITOR_HEADING_LEVELS } from '../../../core/editor-policy.js';
import { createEditorAtom } from './atoms.js';
import { createEditorIdentity } from './identity.js';
import type { EditorIdentityOptions } from './identity-plugin.js';

export function createEditorExtensions(options: EditorIdentityOptions = {}) {
  return [
    StarterKit.configure({
      trailingNode: EDITOR_BEHAVIOR.trailingParagraph,
      heading: { levels: [...EDITOR_HEADING_LEVELS] },
      link: {
        autolink: EDITOR_BEHAVIOR.autoLink,
        linkOnPaste: EDITOR_BEHAVIOR.linkOnPaste,
        openOnClick: EDITOR_BEHAVIOR.openLinks,
        HTMLAttributes: { target: null, class: null, rel: 'noopener noreferrer' },
      },
    }),
    createEditorIdentity(options),
    createEditorAtom('mention'),
    createEditorAtom('emoji'),
  ];
}
