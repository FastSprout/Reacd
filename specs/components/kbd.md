# Kbd

KBD-001: Provide separate schema, named Props/function, adapter, and colocated tests.
Require a nonempty value; accept optional accessible label, explicit apple/other
platform, logical size, semantic intent, and outline/soft/subtle/solid variants. Reject
native HTML, styling, event handlers, arbitrary children, and vendor props.

KBD-002: Recognize Nuxt's documented lowercase key aliases, including platform-specific
meta/ctrl/alt. Preserve unknown/custom values verbatim. Default platform is other, with
no navigator sniffing or delayed server placeholders. Explicit platform produces stable
SSR/hydration. Symbols have human-readable accessible names; a host can override them.

KBD-003: Render passive native keyboard notation without registering handlers or adding
a tab stop. Long values wrap inside containers. Named policies own sizing/defaults. All
variants use contrast-validated token pairs; intent never carries meaning alone.

KBD-004: Follow the owned shadcn Kbd recipe with engine sizing and safe text. Tooltip
shortcut labels may reuse its private presentation while preserving literal label
semantics. Changing a theme/platform/value does not change application state.

KBD-005: Generative 0.2 accepts literal values or a read binding to text state. Validate
initial and live values; unknown keys, invalid kinds, empty values, and write bindings
fail closed. A host update cannot bypass active display constraints.

KBD-006: Require property/type/alias tests, exact adapter mapping, per-file 100%
coverage, portable schema, packed TSX/SSR, hydration, compiled public examples, and
browser containment at both profiles, eight widths, RTL, and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/kbd
- https://github.com/nuxt/ui/blob/v4/src/runtime/composables/useKbd.ts
- https://ui.shadcn.com/docs/components/base/kbd

Nuxt's arbitrary tags/classes/slots are replaced by a closed value contract. Explicit
platform replaces client-only user-agent inference; no browser HTML class is mutated.
