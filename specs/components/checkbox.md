# Checkbox

Status: enterprise extension of the existing compatible controlled boolean component.

CHECKBOX-001: Preserve label, checked:boolean and onCheckedChange(boolean). Add logical
indeterminate:boolean, description, name, submitted value, required and readOnly.
Disabled remains compatible. No arbitrary styling, native events, slots, uncontrolled
values or vendor checked-state objects enter the public API.

CHECKBOX-002: Indeterminate displays mixed state independently of controlled checked.
Mixed state does not satisfy required validation and does not submit a checked value.
Activating a mixed control requests true; the host clears its derived mixed flag when
accepting that action. Never silently mutate host mixed state. Space and pointer/label
activation request exact one-argument boolean callbacks; Enter follows native checkbox
semantics rather than being treated as a second arbitrary action.

CHECKBOX-003: Checked, enabled, non-mixed state serializes configured name/value, with
named core default value on. Disabled omits data and validation. Read-only retains focus
and canonical values, rejects edits and keeps semantic required validation. Invalid
submission focuses the visible checkbox and announces associated feedback. The host must
fix missing readonly business data.

CHECKBOX-004: Consume FormField metadata without cloning labels. Explicit name/required
overrides defaults; disabled combines with OR. Merge description/error IDs once. Keep
controlled field errors associated and preserve nested disabled safety.

CHECKBOX-005: Own generative checkboxNodeSchema binds checked to boolean state with
explicit read/readWrite access. A read binding forces readonly, not disabled. Optional
indeterminate accepts a literal boolean or readonly boolean reference; the host owns
selection aggregation. Validate kinds/access before rendering. No new state kind. Do not
automatically write derived mixed state when committing the checked binding.

CHECKBOX-006: Acceptance includes closed props/schema, exact callback arguments,
controlled declined writes, mixed activation and required/FormData behavior, readonly/
disabled, metadata, keyboard, generative readers/host updates/SSR isolation and both
adapter templates at narrow/200%/RTL geometry. Require 100% each file in all four
coverage categories; unit DOM geometry is not browser proof.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/checkbox
- https://ui.shadcn.com/docs/components/radix/checkbox

Nuxt's indeterminate model becomes an explicit logical boolean to preserve existing
checked:boolean callers and match derived aggregate selection. Cosmetic variants,
indicator placement and custom icons stay in the adapter.
