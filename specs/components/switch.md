# Switch

Status: specified for the named Form catalog batch. Existing Toggle stays compatible.

SWITCH-001: Provide a separate named SwitchProps, strict schema, TSX module and trusted
shadcn adapter. Require visible label, controlled boolean checked and onCheckedChange.
Accept description, logical name, submitted value, required, disabled, readOnly and
loading. Reject styling, native events, uncontrolled defaults and arbitrary icon slots.
This is a complete form control, not an export alias for the existing basic Toggle.

SWITCH-002: Reuse the trusted shadcn/Radix Switch and logical track/thumb CSS. Pointer,
label, Space and Enter request boolean changes. Controlled host rejection preserves the
old checked state. Disabled, readOnly and loading never request changes. Loading exposes
busy status and a real host-controlled progress message, while retaining canonical form
data. Read-only and loading controls remain focusable; disabled controls do not.

SWITCH-003: Native form serialization includes the configured name/value only when
checked and enabled. Default submitted value is the named policy's on token. Required
unchecked state blocks submission and focuses the visible switch. Read-only does not
exempt required business data from validation or remove canonical data from FormData.
The host must provide/fix missing read-only required data; no fake editing is offered.
Disabled fields are excluded from validation and serialization.

SWITCH-004: Participate in FormField metadata. Explicit control name and required props
override inherited defaults; field-level disabled is an unoverrideable safety boundary.
Descriptions and error IDs merge without duplicates. Field errors mark the control
invalid and block native submission. Keep the control's own native label; FormField's
optional caption describes the logical group rather than cloning/replacing child props.

SWITCH-005: Generative 0.2 binds checked to boolean state with explicit read/readWrite
access. Read mode forces readOnly, not disabled, preserving form values and validation.
Host stores/SSR requests remain isolated and adapter/theme changes preserve checked
state. Appearance and thumb geometry belong to the theme adapter.

SWITCH-006: Acceptance covers strict types/schema, all keyboard/pointer transitions,
host rejection, protection/loading, required validity/focus, native FormData, metadata
precedence/association, scoped RTL, SSR/hydration, both templates and narrow/200% text
containment. Every owned executable file needs 100% coverage in all four categories.
Browser geometry remains separate evidence.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/switch
- https://ui.shadcn.com/docs/components/radix/switch
- https://www.radix-ui.com/primitives/docs/components/switch

Nuxt's uncontrolled defaults become controlled host state. Cosmetic sizes, colors, icons
and variants are adapter concerns. Loading does not imply that a remote write occurred;
the host owns asynchronous work and errors.
