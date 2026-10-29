# SelectMenu

Status: requirements before implementation, 2026-10-29. InputMenu is separately
frozen. SelectMenu uses the approved B selection foundation and new logical request
callbacks; it is not a copy of B's legacy void-only Select implementation.

SELECT-MENU-001: Closed TSX searchable selection with per-module inferred named
SelectMenuProps. Require label, complete canonical items, controlled value and matching
callback. Default/optional mode single accepts a key or ''. Explicit mode multiple
accepts a readonly unique key array, with [] unselected. Reuse SelectionOption,
selectionOptionsSchema, singleSelectionValueSchema, multipleSelectionValueSchema and
canRequestSelection without editing their modules. Opaque values such as '42' are
valid; edge whitespace, duplicate/missing keys and style/SDK escapes are rejected.
No component-specific max prop is introduced; canonical budgets apply.

SELECT-MENU-002: The trigger shows complete selected labels in controlled order;
labels wrap without losing full content. Its popup contains an independently labelled
search input and selectable list. Typing/blur never selects a value. Optional query
and onQueryChange are a controlled pair; otherwise query is private and initially
empty. Optional queryReadOnly protects that channel independently of readOnly, which
locks selection but allows search and browsing. Disabled blocks both channels.

SELECT-MENU-003: Optional visibleValues is a unique ordered subset of canonical keys
for external results. Otherwise deterministic local label/description filtering uses
shared form-menu search. Filtering never invalidates or clears offscreen selections.
An empty canonical catalog requires an empty value; visible results may be empty with
any valid selected value. Status ready/loading/error shows distinct visible announced
feedback. Loading/error prevent newly selecting stale results; accepted text/query and
selected labels remain readable. The host owns request cancellation and freshness.

SELECT-MENU-004: Selection, query and disclosure callbacks receive exactly their one
logical value and synchronously return boolean or void. False vetoes; invalid returns,
Promises and throws show associated feedback and stop private side effects. Never pass
native events or SDK details. Every multiple toggle proposes one whole validated array,
preserving retained order and appending additions. No optimistic selected state.
Unchanged requests do not emit duplicate writes. Previously selected disabled keys
remain valid/serialized and may be removed or cleared; newly selecting disabled keys
is forbidden. Single replacement must not be permanently locked by its old value.

SELECT-MENU-005: Query persists across selection/close/blur. No selection interaction
implicitly emits a query write. Single accepted activation requests close; multiple
stays open. A selection veto does neither. Optional open/onOpenChange is an
all-or-neither controlled pair, otherwise disclosure is private. A host may veto
closing. Requiredness only validates native form submission and never blocks an
otherwise valid empty editing request, deselection or clear.

SELECT-MENU-006: Clear/removal controls preserve visible focus. Accepted clear focuses
the trigger; a veto retains focus and value. Arrows browse without selection, Enter
activates, and Tab leaves without implicit selection. Escape closes the inner popup
first without clearing query/value or dismissing a containing Modal/Drawer. Composition
flags and Enter 13/legacy 229 suppress premature activation, removal and submission;
final composition requests query once. No Space interception in editable query.

SELECT-MENU-007: Name submits canonical selected keys only, never query or labels.
Optional empty single submits one ''; empty multiple submits no entries. Multiple
uses repeated same-name fields, preserving controlled order. Disabled omits fields and
focus entry. Required read-only empty selection remains invalid; failure focuses the
visible trigger and announces feedback rather than focusing a hidden bridge. ReadOnly
complete selection remains valid and serialized. No native form/styling props are
public. Required feedback clears when the host supplies a complete value, removes
requiredness or disables the field; callback failure feedback remains independent.
Consume the existing trusted FormField metadata: nearest name/required defaults,
explicit overrides, inherited disabled OR safety, merged descriptions and error IDs.
Disabling a containing scope also blocks writes from an already portaled popup.

SELECT-MENU-008: JSON binds single value to existing text and multiple to selection,
with explicit read/readWrite access. Read value forces readOnly. Optional query binds
a different text key; read query forces queryReadOnly without disabling selection.
Alias between selected value and query is invalid. Optional open is a readWrite boolean
binding. No new state kind/action context. Result failures become logical vetoes.
Mounted membership, uniqueness and budgets constrain host writes and transactions
atomically, with isolated application/request stores. Required does not constrain
empty editing state. Import B's approved generic selection capacity as a dependency.

SELECT-MENU-009: Native rendering belongs to a private Base UI Combobox with its input
inside a popup, shadcn controls and template tokens. Portals inherit the active host,
theme variables, direction and Escape scope. Inactive retained parents cannot leave an
active child popup. Preserve logical Form ancestry. SSR/hydration uses explicit props,
useId and isolated stores without ambient locale/clock, global caches or DOM access in
render. Both templates, narrow screens, RTL, long labels, 200% text and touch targets
must be verified in actual browsers. Layout defaults live in named core policy.

SELECT-MENU-010: Acceptance tests precede production code. Cover closed runtime/types,
both modes, opaque/empty/disabled values, exact callbacks and veto/host rejection,
query access combinations, status/external results, atomic whole-array writes, required
read-only forms/canonical FormData/focus, IME, scoped portals and SSR. Require all-four
100% per owned runtime file and normal types/lint/policy/schema/example/build/package/
docs/browser gates. Heavy checks respect the parent global resource lock; pending
evidence is not acceptance. No timeout, threshold or coverage exclusion changes.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/select-menu
- https://base-ui.com/react/components/combobox
- Installed Base UI 1.9.0 input-inside-popup and controlled event cancellation sources.
- Frozen B selection-foundation manifest and SELECTION-001 through SELECTION-005.

SELECT-MENU-011: The integrated runnable example labels its status switch Loading
records, distinct from the adjacent Select example. Both controls remain uniquely
identifiable by their visible names without positional test selectors. This changes
example copy only, not component defaults or the public API.
