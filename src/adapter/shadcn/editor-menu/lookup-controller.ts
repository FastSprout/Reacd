import { EDITOR_LOOKUP_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/editor-lookup-policy.js';
import {
  editorMentionLookupScopeSchema,
  editorMentionLookupQuerySchema,
  editorMentionLookupRequestSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/editor-mention-menu/lookup.schema.js';
import type {
  EditorMentionLookupRequest,
  EditorMentionLookupResult,
} from '@fastsprout/reacd/adapter-runtime/schema/editor-mention-menu/lookup.schema.js';
import type * as mention from
  '@fastsprout/reacd/adapter-runtime/schema/editor-mention-menu/item.schema.js';

export interface EditorMentionLookupView {
  readonly request: EditorMentionLookupRequest | undefined;
  readonly status: 'loading' | 'ready' | 'error';
  readonly items: readonly mention.EditorMentionItem[];
  readonly error: string | undefined;
}
export interface EditorMentionLookupState {
  readonly scope: string;
  readonly ordinal: bigint;
  readonly current: EditorMentionLookupRequest | undefined;
  readonly accepted: EditorMentionLookupResult | undefined;
}
interface LookupTransition {
  readonly state: EditorMentionLookupState;
  readonly view: EditorMentionLookupView;
}
const EMPTY_ITEMS: readonly mention.EditorMentionItem[] = Object.freeze([]);

function closeState(
  state: EditorMentionLookupState,
  ordinal: bigint,
): EditorMentionLookupState {
  return Object.freeze({
    scope: state.scope,
    ordinal,
    current: undefined,
    accepted: undefined,
  });
}
function errorTransition(
  state: EditorMentionLookupState,
  ordinal: bigint,
  error: string,
): LookupTransition {
  return Object.freeze({
    state: closeState(state, ordinal),
    view: Object.freeze({
      request: undefined,
      status: 'error',
      items: EMPTY_ITEMS,
      error,
    }),
  });
}
function resultView(
  request: EditorMentionLookupRequest | undefined,
  result: EditorMentionLookupResult | undefined,
): EditorMentionLookupView {
  return Object.freeze({
    request,
    status: result?.status ?? 'loading',
    items: result?.status === 'ready' ? result.items : EMPTY_ITEMS,
    error: result?.status === 'error' ? result.error : undefined,
  });
}

export function advanceMentionLookup(
  state: EditorMentionLookupState,
  query: string,
  result: EditorMentionLookupResult | null,
): LookupTransition {
  const parsedScope = editorMentionLookupScopeSchema.safeParse(state.scope);
  if (!parsedScope.success)
    return errorTransition(
      state,
      state.ordinal,
      EDITOR_LOOKUP_POLICY.invalidScopeMessage,
    );
  const parsedQuery = editorMentionLookupQuerySchema.safeParse(query);
  if (!parsedQuery.success)
    return errorTransition(
      state,
      state.ordinal,
      EDITOR_LOOKUP_POLICY.invalidQueryMessage,
    );
  let ordinal = state.ordinal;
  let current = state.current;
  let accepted = state.accepted;
  let request: EditorMentionLookupRequest | undefined;
  if (current === undefined || current.query !== parsedQuery.data) {
    ordinal += 1n;
    const generated = editorMentionLookupRequestSchema.safeParse({
      key: `${parsedScope.data}${EDITOR_LOOKUP_POLICY.keySeparator}${ordinal}`,
      query: parsedQuery.data,
    });
    if (!generated.success)
      return errorTransition(
        state,
        ordinal,
        EDITOR_LOOKUP_POLICY.invalidRequestMessage,
      );
    current = generated.data;
    accepted = undefined;
    request = current;
  }
  if (
    result !== null &&
    result.key === current.key &&
    result.query === current.query &&
    (result.status !== 'loading' ||
      accepted === undefined ||
      accepted.status === 'loading')
  )
    accepted = result;
  return Object.freeze({
    state: Object.freeze({ scope: state.scope, ordinal, current, accepted }),
    view: resultView(request, accepted),
  });
}

export function createMentionLookupController(scope: string) {
  let state: EditorMentionLookupState = Object.freeze({
    scope,
    ordinal: BigInt(EDITOR_LOOKUP_POLICY.initialOrdinal),
    current: undefined,
    accepted: undefined,
  });
  return {
    close() {
      state = closeState(state, state.ordinal);
    },
    update(query: string, result: EditorMentionLookupResult | null) {
      const next = advanceMentionLookup(state, query, result);
      state = next.state;
      return next.view;
    },
  };
}
