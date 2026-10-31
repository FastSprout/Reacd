import { Editor } from '@tiptap/core';
import { expect, it } from 'vitest';
import {
  EDITOR_STANDARD_COMMANDS,
  EDITOR_COMMAND_LABELS,
  EDITOR_DEFAULT_COMMANDS,
  EDITOR_TOOLBAR_POLICY,
} from '../../../core/editor-commands.js';
import { createEditorExtensions } from './extensions.js';
import { canRunSdkCommand } from './commands.js';

it('offers bounded labelled commands without mutating the SDK document', () => {
  const editor = new Editor({
    injectCSS: false,
    extensions: createEditorExtensions(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { reacdId: 'intro' },
          content: [{ type: 'text', text: 'Retained' }],
        },
      ],
    },
  });
  try {
    const before = editor.getJSON();
    const selection: unknown = editor.state.selection.toJSON();
    expect(new Set(EDITOR_STANDARD_COMMANDS).size).toBe(
      EDITOR_STANDARD_COMMANDS.length,
    );
    expect(EDITOR_DEFAULT_COMMANDS.length).toBeGreaterThanOrEqual(
      EDITOR_TOOLBAR_POLICY.minItems,
    );
    expect(EDITOR_DEFAULT_COMMANDS.length).toBeLessThanOrEqual(
      EDITOR_TOOLBAR_POLICY.maxItems,
    );
    for (const command of EDITOR_STANDARD_COMMANDS) {
      expect(EDITOR_COMMAND_LABELS[command].trim().length).toBeGreaterThan(0);
      expect(typeof canRunSdkCommand(editor, { command })).toBe('boolean');
      expect(editor.getJSON()).toEqual(before);
      expect(editor.state.selection.toJSON()).toEqual(selection);
    }
    for (const command of EDITOR_DEFAULT_COMMANDS)
      expect(EDITOR_STANDARD_COMMANDS).toContain(command);
    expect(EDITOR_COMMAND_LABELS.link.trim().length).toBeGreaterThan(0);
  } finally {
    editor.destroy();
  }
});
