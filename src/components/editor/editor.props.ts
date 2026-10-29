import type { z } from 'zod';
import type { editorSchema } from '../../schema/editor/index.js';

type Properties = z.infer<typeof editorSchema>;
type PrivateSelection = Extract<Properties, { onValueChange: unknown }> & {
  readonly selection?: never;
  readonly onEditChange?: never;
  readonly onSelectionChange?: never;
};
type ControlledSelection = Extract<Properties, { onEditChange: unknown }> & {
  readonly onValueChange?: never;
  readonly onSelectionChange?: never;
};
export type EditorProps = PrivateSelection | ControlledSelection;
