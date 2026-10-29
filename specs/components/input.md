# Input

Status: specified enterprise extension of the existing compatible Input module.

INPUT-001: Preserve label, value, onValueChange and the existing closed inputType set.
Add description, name, readOnly, loading, minLength, maxLength and a closed logical
text-autofill intent. No native events, arbitrary attributes, styles, uncontrolled
values, HTML or regex callbacks enter the public API. Each callback receives exactly one
logical string, including native search clearing, paste and composition updates.

INPUT-002: Core policy owns text budgets, default input type and diagnostics. Lengths
count UTF-16 code units. Minimum length constrains nonempty submission, not editable
state. Maximum length constrains controlled values, proposed edits and host generative
writes. Reject CR/LF controlled values and edge ASCII whitespace in email values before
native rendering can silently normalize them; register these same state constraints.
Bounds are ordered integers from zero through the core text budget. Email syntax
constrains submission using the installed schema library's named HTML5 email pattern;
incomplete email drafts remain editable. Password feedback never echoes values.

INPUT-003: Controlled host state remains authoritative. Disabled/readOnly/loading
prevent writes; loading communicates busy state without removing canonical FormData.
Required, minimum and email constraints apply to read-only values too. The host must fix
invalid read-only business data. Disabled controls omit data and validation. Invalid
submission focuses the visible input and shows associated feedback until state is valid.

INPUT-004: Consume FormField metadata without cloning child props. Explicit name and
required override field defaults. Disabled combines with OR. Merge guidance/error IDs
without duplicates and retain the native visible label. Controlled field errors block
submission through their field scope. Preserve existing AuthForm callback compatibility.

INPUT-005: Provide own inputNodeSchema under schema/input. Optional generative transport
binds text with explicit read/readWrite mode; read forces readOnly. Register maximum
length as a shared state constraint, not minimum/email submission rules. Keep
independent host/SSR stores isolated and preserve values across adapter/theme changes.

INPUT-006: Acceptance covers closed schemas/types, native
edits/paste/search/composition, exact callback arguments, declined writes, length/email
drafts and submission, readonly required/minimum/email, native FormData, field
inheritance, loading/disabled, SSR and both-template narrow/200%/RTL browser behavior.
Require 100% all four coverage metrics per executable owned file. Schema validity is not
evidence of browser geometry.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/input
- https://ui.shadcn.com/docs/components/radix/input
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email

Cosmetic sizes, variants, icon slots, direct autofocus and arbitrary input attributes
remain adapter concerns or outside this closed contract. Existing TSX callers need no
new required properties.
