# Select

Status: enterprise extension of existing compatible single-selection Select.

SELECT-001: Preserve label/items/value/onValueChange for existing single callers. Add
explicit multiple mode with readonly string-array value/callback; default mode remains
single and accepts empty string as unselected. Own shared selection data contracts are
specified in selection.md. Public fields include description, placeholder, logical name,
required, disabled, readOnly, loading and optional clearable. No SDK types, native
events, HTML, classes, CSS, render callbacks or uncontrolled values.

SELECT-002: Single and multiple values must belong to the current readonly catalog.
Disabled options cannot be newly selected; existing controlled disabled selections stay
valid and serialized. A host can decline proposals. Clearing requests empty string or
array, even when required; requiredness constrains submission rather than draft editing.
Reject unknown/duplicate SDK proposals. Callbacks receive exactly one matching value.

SELECT-003: Use installed Base UI Select for shadcn adaptation, including multiple,
keyboard/typeahead, disabled options and labelled popup semantics. Read-only permits
browsing existing options but locks commits. Loading locks writes and announces real
host-controlled progress while retaining cached values/data. Disabled prevents editing,
focus and serialization. No new dependency is required.

SELECT-004: Trigger selected labels wrap/clamp within a named core line limit; full
labels remain available in the popup, including readonly browsing. Large multiple
selections use a bounded selected-count summary rather than joining an unbounded label
list. Popup text wraps, stays within viewport bounds and scrolls; no obscured options or
horizontally overflowing trigger. Theme tokens own all geometry/appearance.

SELECT-005: Consume FormField defaults and descriptions without cloning native labels.
Explicit name/required overrides defaults; disabled combines with OR. Single named form
data includes its canonical string (including empty optional state); multiple uses
repeated names for selected keys and omits empty selection. Required empty state blocks
native submission and focuses the visible trigger, including readonly state. Preserve
canonical data independently of SDK hidden fields. Fully clipped SDK mirrors retain
their vendor-owned one-pixel dimensions rather than inheriting the visible interaction
target minimum; visible controls retain the named core target.

SELECT-006: Own public schema is a strict single/multiple mode union with matching
callback types. Own generative selectNodeSchema is one strict object with optional
single/multiple mode enum and state reference. Bind text for single, selection for
multiple, with explicit read/readWrite access; read forces readonly. Register current
catalog membership/uniqueness constraints for shared writes. No new state kind.

SELECT-007: Acceptance includes backward compatibility, discriminated props, closed
catalogs, empty/single/multiple/disabled/readonly behavior, exact callback arguments,
controlled decline, full popup keyboard navigation, clear action, native FormData,
required/field errors, host-state constraints and isolated SSR/hydration. Browser checks
cover both templates, 240/360/768/1440, text200%, scoped RTL, long labels and popup
containment. Require 100% per-file coverage in all four metrics.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/select
- https://base-ui.com/react/components/select

Object model values, arbitrary getters/value-key scripts, groups/separators, style
variants and custom icons are not copied. Higher-level menus own searchable workflows;
Select is a closed non-searchable choice component with builtin keyboard typeahead.
