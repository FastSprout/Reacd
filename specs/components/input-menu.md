# InputMenu

Status: requirements before implementation, 2026-10-29. Separate component-owned
delivery after A acceptance. SelectMenu and B's Select ABI remain outside scope.

INPUT-MENU-001: Closed TSX autocomplete with inferred per-module InputMenuProps. Require
label, controlled text value, matching callback and canonical choice items. Reuse
canonical SelectionOption and existing limits without changing its shared modules. Empty
items are valid. Optional visibleValues is a unique known-key subset controlling
external result order. Otherwise filter label/description deterministically with
case/diacritic folding. No selected-key state or multiple mode exists.

INPUT-MENU-002: Selecting an enabled ready suggestion proposes its label as text, never
its key. Optional TSX-only onSuggestionSelect receives exactly readonly {value:
optionKey, text: optionLabel} before the text request. False veto prevents the text
request and close. Unchanged text emits no duplicate write. Value and open callbacks
receive exactly one logical argument, return boolean or void synchronously, and may veto
with false. Invalid returns or throws show an error and prevent private follow-up
effects. Controlled host rejection never changes displayed/submitted text.

INPUT-MENU-003: Optional open/onOpenChange are an all-or-neither controlled pair;
otherwise disclosure is private and initially closed. Rejected item activation leaves
the popup open. Escape closes the inner popup without clearing text or dismissing its
parent. Tab and blur never select implicitly. Plain Enter without active suggestion
retains normal form behavior. IME composing flags, Enter key 13 and legacy 229 prevent
premature selection and submission. Composition emits its final text once.

INPUT-MENU-004: Disabled blocks callbacks, focus entry and submitted fields. ReadOnly
preserves browsing/focus but blocks text and suggestion callbacks. Loading/error show
distinct visible announced status and prevent stale suggestion activation; typed text
remains editable. Empty results show named feedback. Every message/default/limit and
layout measurement belongs to named core policy or existing design tokens.

INPUT-MENU-005: Optional logical name submits the accepted text exactly once. Required
is native form validation only, so clearing remains a valid editing request. Required
read-only empty values are invalid too; failure focuses the visible input. Disabled
alone is exempt. No native event, arbitrary HTML/CSS, SDK value, ref, render callback or
styling escape is public. Descriptions and diagnostics have accessible association.
Accepted clear returns focus to the input when its clear control disappears; an explicit
veto preserves focus and text. The registered SDK clear control remains keyboard
reachable after popup dismissal, requests text exactly once and does not close an open
popup when the host vetoes. Value and suggestion labels reject CR/LF instead of silently
normalizing browser input. Empty, numeric-looking and space text remain valid. TSX, JSON
initial bindings, active host writes and transactions use the same single-line text
schema so native value and FormData cannot diverge. Required feedback follows current
canonical text and flags. A valid host update, disabled control or removed required flag
clears obsolete required feedback without requesting a user write. Callback failures
remain a separate diagnostic channel.

INPUT-MENU-006: JSON transport binds value to existing text state with explicit read or
readWrite access; read forces readOnly. Optional open requires a readWrite boolean
reference. Same value/open keys are invalid by kind. Binding errors remain visible;
Result failures veto SDK effects. No suggestion preflight action, persistent option ID,
new state kind or GenerativeActions context is introduced. Active text constraints apply
to host updates and atomic transactions with isolated Jotai stores.

INPUT-MENU-007: Private Base UI Autocomplete and shadcn controls own native rendering.
Portals inherit active host, theme variables, scoped direction and Escape handling,
including inside Modal/Drawer. Hidden parent content cannot keep an active popup. SSR
uses explicit props/useId and request-local stores; no ambient clock, locale or document
lookup during render. Both templates, narrow widths, long labels, 200% text, RTL,
pointer/touch and keyboard must preserve visible focus and local scrolling.

INPUT-MENU-008: Acceptance covers strict schema and type rejection, exact callback
order/arguments/veto/invalid return, host rejection, empty/loading/error, disabled and
readOnly, native FormData/required focus, IME and nested portals, SSR/hydration and
state access/atomic rejection. Require all-four 100% coverage per owned runtime file,
strict types, typed lint, source policy, schema freshness, build/package, runnable TSX
examples, browser proof and strict MkDocs. Schema validity is not rendering evidence.

INPUT-MENU-009: Consume FormField's trusted logical metadata. Explicit name/required
overrides the scope default; disabled combines with OR. Merge outer description/error
IDs and invalid feedback without duplicating announcements. Disabling an ancestor scope
immediately protects a previously open portal, validation and serialization; a child
cannot re-enable it. No metadata or native attributes enter public Props.

Primary references: Nuxt InputMenu autocomplete mode and Base UI Autocomplete 1.9.0:

- https://ui.nuxt.com/docs/components/input-menu
- https://base-ui.com/react/components/autocomplete
- Installed AutocompleteRoot, ComboboxItem and ComboboxInput sources/declarations.
