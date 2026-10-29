import type { z } from 'zod';
import type { editorMentionMenuSchema } from
  '../../schema/editor-mention-menu/index.js';

type Properties = z.infer<typeof editorMentionMenuSchema>;
type Local = Extract<Properties, { items: unknown }> & {
  readonly results?: never;
  readonly onQueryChange?: never;
};
type Remote = Extract<Properties, { results: unknown }> & {
  readonly items?: never;
};
export type EditorMentionMenuProps = Local | Remote;
