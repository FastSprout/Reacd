# InputTags

Status: specified; implementation waits for the coordinated verification gate.

TAGS-001: Provide a dedicated named Props/schema/TSX module for a controlled readonly
string array and logical array-change callback. Require a visible label. Tags are
trimmed, nonempty, bounded, unique strings; Unicode is valid. Require named policies for
count, per-tag length, delimiters and defaults. Reject unknown/native/style props, raw
event callbacks and markup slots.

TAGS-002: Support description, placeholder, maximum tag count, maximum tag length,
disabled, readOnly, required and logical name. Selection state currently bounds each
token through rowIdSchema, so tag limits must be compatible rather than accepting a TSX
value that generative state cannot represent. Controlled invalid values fail validation
instead of being silently changed or truncated.

TAGS-003: Use the shadcn Base UI Combobox chip pattern for keyboard focus and removal.
Keep the freeform draft separate from committed tags. Enter commits a valid draft;
selected chips support arrows, Backspace/Delete, and labelled remove actions. Removing a
tag never submits its parent form. A host that rejects a change retains its controlled
committed values.

TAGS-004: Preserve add-on-paste, add-on-tab and add-on-blur as logical options.
Delimiter choices are a closed finite vocabulary, never a runtime RegExp. Composition
prevents committing Enter, delimiter, blur or intermediate IME events prematurely.
Pasted batches commit atomically: a rejected token or limit must not silently discard
user data. Failed drafts remain editable and expose visible, accessible validation
feedback.

TAGS-005: Preserve existing tokens at the maximum and keep removal available.
Disabled/read-only fields cannot add, delete or mutate drafts. Required means at least
one committed token; an uncommitted draft does not satisfy it. Native form values
preserve token boundaries. Hidden validation inputs remain bounded in RTL and must not
steal focus from the visible control on invalid submission.

TAGS-006: Generative 0.2 binds selection state with read/readWrite references. Read
bindings render read-only chips. Initial values and active shared host writes obey
uniqueness, count and length limits. Bindings share isolated Jotai stores. SSR and
hydration preserve labels and tag values.

TAGS-007: Cover strict schemas, named consumer types, keyboard and pointer removal,
composition, paste, duplicate rejection, protected fields, rejected host writes, native
form validity, state permissions/constraints and hydration. Compile and exercise a
public TSX/Jotai preview using only reacd components. Require 100% per-production-file
statement/branch/function/line coverage and browser checks in both templates, narrow
screens, 200% text and scoped App RTL.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/input-tags
- https://ui.shadcn.com/docs/components/base/combobox
- https://base-ui.com/react/components/combobox

The default Nuxt unique-tag model maps to selection state. Object converters,
polymorphic rendering, duplicate multisets and cosmetic slots are outside this closed
contract. Adding duplicate-token support requires an explicit state contract extension;
it cannot be emulated by corrupting unique selection IDs.
