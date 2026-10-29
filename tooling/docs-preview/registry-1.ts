import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup1 = {
  Editor: previewEntry('examples/editor.tsx', () =>
    import('../../docs/examples/editor.js').then((module) => ({
      default: module.EditorExample,
    })),
  ),
  EditorToolbar: previewEntry('examples/editor-toolbar.tsx', () =>
    import('../../docs/examples/editor-toolbar.js').then((module) => ({
      default: module.EditorToolbarExample,
    })),
  ),
  EditorDragHandle: previewEntry('examples/editor-drag-handle.tsx', () =>
    import('../../docs/examples/editor-drag-handle.js').then((module) => ({
      default: module.EditorDragHandleExample,
    })),
  ),
  EditorSuggestionMenu: previewEntry('examples/editor-suggestion-menu.tsx', () =>
    import('../../docs/examples/editor-suggestion-menu.js').then((module) => ({
      default: module.EditorSuggestionMenuExample,
    })),
  ),
  EditorMentionMenu: previewEntry('examples/editor-mention-menu.tsx', () =>
    import('../../docs/examples/editor-mention-menu.js').then((module) => ({
      default: module.EditorMentionMenuExample,
    })),
  ),
  EditorEmojiMenu: previewEntry('examples/editor-emoji-menu.tsx', () =>
    import('../../docs/examples/editor-emoji-menu.js').then((module) => ({
      default: module.EditorEmojiMenuExample,
    })),
  ),
  SelectMenu: previewEntry('examples/select-menu.tsx', () =>
    import('../../docs/examples/select-menu.js').then((module) => ({
      default: module.SelectMenuExample,
    })),
  ),
  Listbox: previewEntry('examples/listbox.tsx', () =>
    import('../../docs/examples/listbox.js').then((module) => ({
      default: module.ListboxExample,
    })),
  ),
  ColorPicker: previewEntry('examples/color-picker.tsx', () =>
    import('../../docs/examples/color-picker.js').then((module) => ({
      default: module.ColorPickerExample,
    })),
  ),
  FileUpload: previewEntry('examples/file-upload.tsx', () =>
    import('../../docs/examples/file-upload.js').then((module) => ({
      default: module.FileUploadExample,
    })),
  ),
  InputMenu: previewEntry('examples/input-menu.tsx', () =>
    import('../../docs/examples/input-menu.js').then((module) => ({
      default: module.InputMenuExample,
    })),
  ),
  Switch: previewEntry('examples/switch.tsx', () =>
    import('../../docs/examples/switch.js').then((module) => ({
      default: module.SwitchExample,
    })),
  ),
  Textarea: previewEntry('examples/textarea.tsx', () =>
    import('../../docs/examples/textarea.js').then((module) => ({
      default: module.TextareaExample,
    })),
  ),
  FormField: previewEntry('examples/form-field.tsx', () =>
    import('../../docs/examples/form-field.js').then((module) => ({
      default: module.FormFieldExample,
    })),
  ),
  ChatPrompt: previewEntry('examples/chat-prompt.tsx', () =>
    import('../../docs/examples/chat-prompt.js').then((module) => ({
      default: module.ChatPromptExample,
    })),
  ),
  ChatPromptSubmit: previewEntry('examples/chat-prompt-submit.tsx', () =>
    import('../../docs/examples/chat-prompt-submit.js').then((module) => ({
      default: module.ChatPromptSubmitExample,
    })),
  ),
  ChatPalette: previewEntry('examples/chat-palette.tsx', () =>
    import('../../docs/examples/chat-palette.js').then((module) => ({
      default: module.ChatPaletteExample,
    })),
  ),
  LocaleSelect: previewEntry('examples/locale-select.tsx', () =>
    import('../../docs/examples/locale-select.js').then((module) => ({
      default: module.LocaleSelectExample,
    })),
  ),
  ColorModeImage: previewEntry('examples/color-mode.tsx', () =>
    import('../../docs/examples/color-mode.js').then((module) => ({
      default: module.ColorModeExample,
    })),
  ),
  ColorModeAvatar: previewEntry('examples/color-mode.tsx', () =>
    import('../../docs/examples/color-mode.js').then((module) => ({
      default: module.ColorModeExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;
