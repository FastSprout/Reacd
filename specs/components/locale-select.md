# LocaleSelect

Status: specified for Agent B implementation; integrated acceptance is separate.

LOCALE-001: Provide a dedicated controlled TSX component with required label, value,
locales and onValueChange. Each locale is a closed readonly code/label DTO. Codes must
be canonical Intl BCP 47 identifiers and unique. The selected code must exist in the
bounded nonempty list. Labels come from host translation resources; the component does
not invent language names, download resources or change document language.

LOCALE-002: Optional description, logical name, required, disabled and readOnly use the
shared form/interaction contract. Native FormData carries the canonical selected code.
Disabled controls are omitted; readonly controls retain their value and never request
changes. Host rejection leaves the previous controlled selection visible.

LOCALE-003: The shadcn adapter uses the trusted Select recipe and scoped themed portal.
Keyboard navigation, typeahead, Escape and focus restoration remain available. Readonly
options can be inspected but cannot change data. App direction controls the interaction
layout. Long selected labels and options wrap rather than silently clipping.

LOCALE-004: Generative transport binds value to existing text-kind state with explicit
read/readWrite access. A list-specific constraint protects initial and subsequent host
writes. Read mode forces readOnly. The control adds no state kind or global language
store. Applications decide how the selected code changes App.language or translations.

LOCALE-005: Acceptance covers invalid/case-aliased codes, duplicate or empty lists,
missing selections, closed props, native/style escapes, keyboard and pointer changes,
readonly/disabled states, host rejection, FormData, isolated stores and SSR/hydration.
Both profiles, narrow screens, 200% text, actual RTL, option portals, visible labels and
focus are browser acceptance. Every executable owned file needs 100% in all four
metrics.

LOCALE-006: Server output includes the host-selected label before portal options mount.
The adapter renders that label explicitly so hydration does not depend on a client
option collection. A private unvalidated selection falls back to its literal code;
the public schema still rejects values outside the locale list.

References checked 2026-10-29:

- https://ui.nuxt.com/docs/components/locale-select
- https://www.radix-ui.com/primitives/docs/components/select

React adaptation: explicit host locale DTOs and callbacks replace a Nuxt i18n plugin.
Arbitrary slots, native rendering props, flags, HTML and CSS overrides are unavailable.

LOCALE-007: Main-workbench acceptance opens Actions and feedback, the actual family
that mounts LocaleSelect. Keep all keyboard, native data, protection, focus, RTL
and narrow/200% geometry assertions; family navigation is test setup only.
