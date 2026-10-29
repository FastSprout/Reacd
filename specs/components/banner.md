# Banner

BANNER-001: A Banner has required title, controlled open and onOpenChange, optional
description, semantic alert intent, dismissible flag, accessible close label and
reacd-only actions slot. Default intent is info and default dismissible is false. Native
elements, styles, events and arbitrary rendering are rejected.

BANNER-002: A closed banner renders nothing. Dismissal requests false through
onOpenChange and never mutates host state. The host decides whether it closes.
Dismissible banners have a keyboard-operable, labelled shadcn close button. Action
components retain their own callbacks and state, including while the template changes.
Urgent warning/error uses alert; info/success uses status. Full text and controls wrap
at narrow widths and 200% text; no fixed height.

BANNER-003: Compose shadcn Alert/Button inside the trusted adapter. Only design tokens
configure visual style. Generative 0.2 uses a readWrite boolean state reference for open
and recursively validated action declarations. Persistence belongs to the isolated host
state store, never global localStorage side effects.

BANNER-004: Acceptance includes contract/type failure cases, controlled close, no-close
mode, every intent, optional content/actions, template change, keyboard, state
isolation, SSR/hydration, compiled docs and browser geometry. Every production file
requires 100% coverage; schema validation alone proves no browser geometry.

BANNER-005: The runnable preview provides scoped App direction. RTL conformance
activates that context and asserts computed direction on the rendered notice, including
working actions and close controls.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/banner
- https://ui.shadcn.com/docs/components/alert
- https://ui.shadcn.com/docs/components/button

Nuxt's localStorage id and arbitrary tags/styles remain outside the component. Host
Jotai state owns visibility and any deliberate persistence policy.
