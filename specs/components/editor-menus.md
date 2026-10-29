# Editor suggestion, mention and emoji menus

EDITOR-MENU-001: Each menu is a separate closed TSX component inside an Editor.
EditorSuggestionMenu receives labelled supported block commands. EditorMentionMenu
receives stable mention ids and labels. EditorEmojiMenu receives names and bounded
Unicode values. Each menu requires its own accessible label and an ordered unique item
catalog; disabled intent is optional. No raw HTML, SDK instance, extension, rendering
callback, arbitrary command handler, positioning or style prop is accepted.

EDITOR-MENU-002: Private @tiptap/suggestion 3.32.1 owns trigger/range/IME matching:
slash opens suggestions, at-sign opens mentions and colon opens emoji. Query length,
catalog size and result count have named core limits. Filtering uses case-insensitive
item labels, preserving declared order. Native editor focus stays in the textbox while
ArrowUp/ArrowDown select enabled results, Enter inserts/applies one result and Escape
closes. Disabled results never execute; empty results remain labelled and dismissible.

EDITOR-MENU-003: A suggestion command atomically removes its trigger/query and applies a
closed block operation. Mention/emoji selection atomically replaces the typed range with
an owned safe inline atom and a trailing text space. All changes follow the same bounded
document callback/reconciliation boundary as typing. Host rejection restores the
controlled document; a menu never invokes an application callback directly.

EDITOR-MENU-004: Menus render a bounded in-flow results panel in the Editor auxiliary
slot. This deliberate adaptation avoids overlapping the caret, unsafe placement props
and mobile clipping; it retains the functional trigger/search/keyboard contract rather
than exposing upstream floating-position configuration. A visible label, option states,
empty state and the textbox's active-descendant relationship communicate current focus.
Pointer selection preserves editing focus. Each editor permits one menu per trigger.
Duplicate trigger registrations or orphan menus show actionable diagnostics.

EDITOR-MENU-005: Disabled/read-only/hidden scopes do not register active suggestions.
Cleanup releases the native plugin and ARIA ownership without leaking another editor's
state. Catalog changes update the next query without recreating the editor. Optional
JSON carries only literal closed menu catalogs; Jotai continues to own the document.

EDITOR-MENU-006: Acceptance covers real trigger typing, filtering, keyboard/pointer
selection, empty/disabled items, IME, Escape, stale/duplicate registrations, isolated
editors, host rejection, protected modes and deterministic SSR/hydration. Runtime files
require 100% of all four coverage metrics. Browser proof is required separately for
caret/focus, narrow/RTL/zoom and panel containment. No catalog acceptance is implied by
this specification.

EDITOR-MENU-007: Mention supports disjoint local items or correlated remote mode. Remote
props require results:null|LookupResult and onQueryChange(request), forbidding items.
Requests are frozen {key, query}; results echo both and select loading, ready (with
bounded unique items) or error (with bounded nonempty plain text). No initial request
occurs during rendering/SSR/startup. A changed active native query issues one new
deterministic scoped ordinal key. A new open cycle retains the ordinal but gets a new
key. Same-query A/B/A races therefore cannot reuse a previous response identity.

EDITOR-MENU-008: Remote ready items are server-authoritative and are not substring
filtered again. Both key and query must match. A stale/null response retains the last
accepted ready/error view for the current request; without one the panel shows loading
and no old items. Matching late loading cannot replace accepted terminal data. Matching
ready/error may replace one another when the host resolves/retries outside the menu. The
runtime performs no network request or executable lookup expression. Query, scope, key,
item and error budgets are named. Invalid private scope/query values produce a bounded
diagnostic rather than a callback. Optional JSON remains literal-local only.

EDITOR-MENU-009: Removing one trigger plugin may recreate remaining SDK plugin views.
That internal view teardown does not close another trigger whose native plugin state is
still active. Preserve its result view, request correlation, selection and ARIA owner;
actual Escape/trigger exit still clears it. Disposed leases ignore late callbacks before
resolving any host lookup and release their exact owned registration once.
