# PinInput

PIN-001: Expose a controlled string value, change callback, visible label, and optional
completion callback through separate Props/schema/TSX modules. Preserve leading zeros.
Length defaults to six and accepts one through twelve characters. Numeric and ASCII
alphanumeric modes reject characters outside their alphabet. Reject unknown props,
native elements, styling, and browser event callbacks.

PIN-002: Support mask, OTP autocomplete, description, required, disabled, readOnly,
logical name, and optional grouping through separatorEvery. Masking hides visible
characters without claiming cryptographic protection. A required code is valid only when
all slots are filled. Empty optional codes are valid.

PIN-003: The shadcn adapter uses input-otp, its upstream OTP primitive. One accessible
input supports selection, arrows, deletion, replacement, paste, mobile OTP autofill, and
a host that rejects changes. Paste removes whitespace and hyphen separators before
alphabet validation. Completion fires on a user change reaching full length, never
merely because a full value was mounted.

PIN-004: Disabled/read-only input cannot emit changes or completion. All slots are
visual and hidden from assistive technology; one labelled input carries the value and
validation. Stable generated IDs hydrate without mismatch. Grouping and focus styling
are adapter concerns; overflow stays within the field.

PIN-005: Generative 0.2 binds to writable text state with length and alphabet
constraints. Invalid initial values and host writes are rejected. Completion callbacks
are host TSX behavior, not executable generative transport values. Registered completion
actions require an accepted state write; conflicting active bindings cannot dispatch
completion for an uncommitted code.

PIN-006: Require schema/type/interaction/state/failure tests, compiled examples,
SSR/hydration, adapter coverage, browser keyboard/paste/form/containment checks, and
100% per-file statement, branch, function, and line coverage before acceptance.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/pin-input
- https://ui.shadcn.com/docs/components/base/input-otp
- https://input-otp.rodz.dev/

Nuxt's character array becomes a string to preserve one controlled source of truth and
shared text-state compatibility. Cosmetic slots/icons and local CSS remain private
adapter choices.
