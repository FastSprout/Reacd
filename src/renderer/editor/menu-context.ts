import { createContext } from 'react';
import type { EditorCommand } from '../../core/editor-commands.js';
import type { EditorMenuKind } from '../../core/editor-menu-policy.js';
import type { Result } from '../../core/result.js';

export type EditorMenuItem = Readonly<
  { label: string; disabled?: boolean | undefined } & (
    | { kind: 'suggestion'; value: EditorCommand }
    | { kind: 'mention'; id: string }
    | { kind: 'emoji'; name: string; value: string }
  )
>;
export interface EditorMenuView {
  readonly query: string;
  readonly items: readonly EditorMenuItem[];
  readonly selected: number;
  readonly status: 'loading' | 'ready' | 'error';
  readonly error: string | undefined;
}
export interface EditorMenuLookupState {
  readonly status: 'loading' | 'ready' | 'error';
  readonly items: readonly EditorMenuItem[];
  readonly error: string | undefined;
}
export interface EditorMenuRequest {
  readonly kind: EditorMenuKind;
  readonly listId: string;
  readonly items: () => readonly EditorMenuItem[];
  readonly lookup?: ((query: string) => EditorMenuLookupState | undefined) | undefined;
  readonly change: (view: EditorMenuView | undefined) => void;
}
export interface EditorMenuLease {
  readonly choose: (index: number) => void;
  readonly close: () => void;
  readonly refresh: () => void;
  readonly destroy: () => void;
}
export interface EditorMenuPort {
  readonly disabled: boolean;
  readonly mount: (request: EditorMenuRequest) => Result<EditorMenuLease>;
}
export const EditorMenuScopeContext = createContext<EditorMenuPort | null>(null);
