# User

USER-001: User is a closed TSX declaration with a schema-derived named Props module. A
required name, optional description, validated avatar source/fallback, logical size and
orientation describe a person. Optional safe href or onPress enables navigation or an
action, never both. Disabled applies only to an action. Native elements, styling,
arbitrary rendering and native events are rejected.

USER-002: The shadcn adapter composes the existing Avatar primitive and an owned
identity layout. Plain users have no tab stop. Links retain native navigation; actions
use a native button with keyboard activation and disabled semantics. Name and
description wrap without clipping or hiding actions in narrow layouts. Vertical
orientation places the avatar above the identity. Logical properties support RTL. Every
size uses named Avatar policy values.

USER-003: Generative transport accepts the same literal identity data and an optional
registered action name in place of a callback. The host resolves actions; transport
never accepts executable code. SSR preserves identity and semantics. Template changes
retain callbacks, links, full text and accessible names.

USER-004: Acceptance includes closed schema/type tests, plain/link/button behavior,
keyboard and disabled actions, optional image/fallback, sizes/orientations, generative
schema/actions, SSR/hydration, compiled docs and browser geometry. Require 100% coverage
per production file. Schema validity alone does not prove browser layout.

USER-005: The runnable preview provides scoped App direction. RTL conformance activates
that context and asserts computed direction; document.dir alone may be overridden by a
nested primitive provider.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/user
- https://ui.shadcn.com/docs/components/avatar
- https://ui.shadcn.com/docs/components/button

Nuxt's arbitrary tags, style overrides and raw events remain private. Avatar size uses
small/medium/large, matching the existing reacd Avatar contract.
