# Textarea

Status: specified for the named Form catalog batch. Existing TextArea stays compatible.

TEXTAREA-001: Provide a distinct named TextareaProps, strict schema, TSX module and
trusted shadcn adapter. Require label, controlled string value and onValueChange. Accept
description, placeholder, name, required, disabled, readOnly, minLength, maxLength,
rows, autoResize and maxRows. Reject styling, DOM events and uncontrolled defaults.
String/length limits count UTF-16 code units, matching native text length conventions.

TEXTAREA-002: Core policy owns row bounds, default rows, maximum string length and
measurement fallbacks. Row limits are inclusive positive integers; maxRows cannot be
less than rows. Length limits are ordered integers between zero and the core text
budget. Values never exceed maxLength. Minimum length does not reject editable drafts;
it constrains submission of nonempty values. Requiredness separately rejects empty.

TEXTAREA-003: Pointer/keyboard entry, newlines, paste and IME update controlled text.
Disabled/readOnly do not request changes. A host declining a write keeps its value.
Over-budget synthetic/native candidates cannot bypass the configured maximum. Native
FormData uses the effective field name. Disabled fields are omitted. Read-only fields
retain canonical data and still satisfy required/minimum/field-error semantic validity;
the host must fix missing read-only required data rather than bypassing validation.

TEXTAREA-004: autoResize measures trusted native scroll height after value, row-policy,
width and font changes. It grows and shrinks between rows and maxRows, including
pre-filled values and long wrapped lines. At the cap, internal vertical scrolling keeps
all text reachable. Automatic row measurement preserves focus and selection and occurs
before paint. Manual vertical resize is available when automatic sizing is off. Missing
ResizeObserver uses window resize fallback. Invalid/unavailable font metrics use named
core fallbacks; do not insert pixel limits in application code.

TEXTAREA-005: Participate in FormField metadata with explicit name/required precedence
and non-overridable inherited disabled. Merge description/error IDs without duplicates.
Associated errors mark the textarea invalid and block native form submission. Client
required/minimum feedback appears after attempted invalid submission and clears when
state becomes valid. Focus the visible textarea rather than a hidden form projection.
Preserve the control's native label and the optional FormField group caption.

TEXTAREA-006: Generative 0.2 binds value to text state with explicit read/readWrite
mode. Read bindings force readOnly. Register maximum-length constraints on host writes;
do not apply minLength as a state-write constraint because partially edited strings are
valid editing state. Independent application/SSR stores and adapter changes preserve
text.

TEXTAREA-007: Acceptance covers schemas/types, controlled input/paste/newlines/IME,
length boundaries, protection, native and semantic read-only validity, FormData,
metadata precedence, auto grow/shrink/cap, observer cleanup/fallback, SSR/hydration and
both-template narrow/200%/RTL browser containment. Every executable owned file must have
100% statements, branches, functions and lines. Measurement unit mocks are not browser
proof of wrapping or geometry.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/textarea
- https://ui.shadcn.com/docs/components/radix/textarea
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea

Nuxt autoresize/maxrows become bounded autoResize/maxRows. Unlimited growth, arbitrary
CSS, icons, render slots, uncontrolled values and autofocus side effects are excluded
from this closed contract. Existing TextArea retains its earlier API during migration.
