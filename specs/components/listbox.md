# Listbox

Status: isolated acceptance verified; combined acceptance pending. A owns this module.
Canonical pure selection contracts come from B's immutable selection-foundation.
No live B, fork-a or root files may be edited. Work stays local.

LISTBOX-001: Provide one closed TSX Listbox component, named schema-derived Props,
strict per-module runtime/transport schemas and exhaustive shadcn registration.
Default mode is single; explicit mode multiple selects a readonly unique vector.
Require label, items, controlled value and matching onValueChange. Callbacks return
boolean or void. No children, arbitrary render callbacks, styling/native props,
refs, links, item actions, dimensions, custom filter functions or SDK objects.

LISTBOX-002: Reuse schema/selection and SELECTION_POLICY without alternate option
DTOs. Values are opaque canonical strings, including '42'; edge whitespace is
invalid. Single empty is ''; multiple empty is []. Catalogs may be empty and are
bounded and unique. Selected values must belong to the full current catalog.
There is no multiple:boolean, nullable sentinel, grouping, query or max dialect.
Each component owns its own inferred Props; B owns the shared pure contracts.

LISTBOX-003: Optional props are description, name, required, disabled, readOnly,
locale, status, emptyMessage, loadingMessage, errorMessage and clearLabel. Status
is ready/loading/error, default ready. Locale is a finite supported choice with
explicit en-US default. All descriptions/messages are bounded plain text.
Readonly/required/disabled default false. Named core policies own all defaults.
There is no uncontrolled selection, implicit first-option value or open state.

LISTBOX-004: Use the official narrow react-aria-components/ListBox entry in the
trusted adapter. It owns roving option focus, one list Tab stop, Up/Down/Home/End,
typeahead and native pointer selection. This curated contract is vertical only.
Focus and typeahead never select. No custom keyboard engine is introduced by
anticipation. App direction controls text/layout; locale controls SDK collation.
Use the pinned SDK's typeahead lifecycle, without an ambient OS locale or clock
choosing initial state. Do not invent a public typeahead timeout override.

LISTBOX-005: The host selection is authoritative, including after veto or a host
that leaves props unchanged. Convert SDK selection into a fresh complete logical
candidate, preserving retained host order and appending additions in catalog
order. Request exactly once with the string/vector only. No-op candidates do not
emit. False vetoes; true/void allow the request. Invalid return values, Promises
and throws show feedback and fail closed. Never accept a Result object as true.
The engine cannot undo external mutations a host made before returning false.

LISTBOX-006: Disabled catalog options cannot be newly selected. Existing selected
disabled keys remain valid, visible and serialized. The named Clear selection
button can request empty selection, including clearing selected disabled keys;
RAC keeps disabled options unavailable for new interaction. No field mutation
or callback runs from readonly, disabled or non-ready selection attempts.
After a permitted Clear action from its focused button, focus returns to the
visible list before the button becomes disabled. Preserve focus placed elsewhere
by the host. Veto leaves the Clear control focused.
Readonly and busy lists remain inspectable with navigation/typeahead. Disabled
controls leave Tab order and omit form entries. Clear reflects all protections.

LISTBOX-007: Multiple uses modifier-free toggle behavior. Ctrl/Meta+A requests a
complete permitted selection, preserving retained disabled keys without newly
selecting disabled options. Escape preserves selection and parent Escape scope.
IME composition and Enter keyCode13/isComposing must not select, clear or submit
a surrounding form. If the pinned SDK fails an acceptance case, record the red
and add only the smallest trusted event boundary needed to repair that defect.

LISTBOX-008: name associates canonical values with the nearest actual native
form. Single posts the string, including ''. Multiple posts repeated same-name
entries in host order; empty multiple posts no entries. Selected disabled keys
remain serialized unless the whole component is disabled. Readonly required
empty values remain invalid; disabled alone exempts validity/serialization.
Requiredness concerns native submission, not storing/clearing empty editing
values. Invalid submission focuses the meaningful visible list/option, exposes
associated feedback and never focuses an offscreen validation proxy.

LISTBOX-009: Native reset requests the complete initial logical value once, using
current catalog/protection and host authority. It must not cancel reset of other
native controls or invent an SDK default value. Empty initial values stay empty.
Reuse the existing trusted Form/portal boundary; Listbox creates neither one.
An initial disabled key that is no longer selected cannot be newly restored by
user reset. That refused request preserves the current value; unrelated native
fields still reset. No business field uses a generated SDK ID as its name.

LISTBOX-010: Generative value is one explicit state reference with read/readWrite
access. Single binds text; multiple binds selection. Read forces effective
readOnly, even if the literal prop says false. Writers return the registry
Result.success boolean to the request boundary. Mounted membership/uniqueness
and global capacity constraints apply to shared host writes and transactions.
Requiredness does not impose nonempty shared state. Refused writes publish no
subset; feedback and native values recover after a valid request or host update.
Invalid/missing bindings show diagnostics before rendering capabilities.

LISTBOX-011: Loading/error retain current selected labels/domain and form values;
they cannot commit stale result choices. Status/empty messages are announced but
never become submitted values. Clearing selection obeys the same state guards.
Long labels/descriptions remain fully readable and wrap within adapter rules.
RAC currently filters these semantic attributes and its all-disabled root stays
tabbable. The trusted adapter repairs readonly/required/invalid/disabled/busy
attributes and observes only the disabled root tabindex. It disconnects on
reenable/unmount and never replaces SDK keyboard or active-item internals.
The bounded vertical viewport scrolls active content within its own container;
it must not push text or options outside a 240px page at 200% text in either
template. Focus, selected state, validation and readonly remain distinguishable.

LISTBOX-012: SSR renders deterministically with useId and explicit locale; no
autofocus, browser measurement or ambient language chooses initial markup.
Hydration, separate providers, request stores and simultaneous lists remain
isolated. Catalog removal/reordering reconciles focus without changing selected
business state; hosts must publish valid catalog/value pairs atomically.

## Acceptance and delivery

Acceptance precedes implementation: schema/types, opaque keys, bounds, empty
catalogs, unknown/duplicate values, exact callback args, veto/invalid/throw/async
results, controlled refusal, immutability, protection and status. Verify native
forms/required/reset, disabled selected clearing, keyboard/typeahead/Escape/IME,
focus retention, SSR/hydration, shared constrained writes/refusal/recovery, direct
missing bindings, RTL, narrow/200% text and both templates in Chromium.

Every owned executable file must have 100% statements, branches, functions and
lines, without exclusions/suppression. Compile runnable TSX docs, test previews,
and run relevant strict types, lint, policy, package, schema, docs and browser
checks in a coordinated resource slot. Each maintained file stays below 300
lines/88 columns with two-space indentation. Freeze exact paths, hashes, baseline
diffs and evidence. Central registrations are integration proposals only.

Final independent Standards and Spec reviews, corrections and combined A/B
verification remain required after B scope completes. Internal requirements and
verification records never go in public docs. No publish/push/deploy is allowed.

Primary references: Nuxt UI Listbox, WAI-ARIA APG listbox pattern and the official
React Aria ListBox entry. SDK conformance is established by tests, not schemas.

ARIA role reference: https://www.w3.org/TR/wai-aria-1.2/#listbox . Its supported
readonly/required properties and inherited invalid/disabled states justify the
closed trusted semantic bridge; the SDK interaction implementation remains intact.

## FormField metadata integration

LISTBOX-013: Consume the exact renderer FormField metadata contract before model,
validation and serialization. Explicit name overrides the inherited name; absent
name inherits. Required inherits as a default, with explicit child required
remaining authoritative. Disabled combines with OR so child false cannot reenable
an outer disabled field. These are existing FORM-FIELD-003/005 semantics, not new
public props. Do not mutate the B-owned context or shared source.

LISTBOX-014: Merge outer description/error IDs with local feedback without
remounting controls or duplicating IDs. Outer error marks the visible list invalid;
its controlled text remains owned by FormField. Native validation still follows
effective required/disabled and readonly values. Test inherited and explicit names,
required readonly emptiness, explicit required false, disabled scope transitions,
writer suppression and feedback reading before implementation.

LISTBOX-015: The runnable inline-region example uses distinct domain labels and
status copy when mounted beside Select and SelectMenu examples. Its switches use
Read-only regions and Right to left regions; unsaved/saved feedback remains
unambiguous to people and named browser queries.
This documentation requirement changes no control defaults or public contract.
