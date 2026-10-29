# ContentSurround

Status: specified for isolated Agent A implementation.

SURROUND-001: ContentSurround presents adjacent document destinations in a named
navigation landmark. Optional previous/next objects require title and validated href;
description and newWindow are optional. No route, title or destination is fabricated.

SURROUND-002: Previous and next have visible engine-owned direction labels as well as
the document title. Destination labels wrap without hiding information. The two
destinations reflow intrinsically, remain in declaration order, and respect scoped RTL.
There is no native tag, CSS, icon callback, dimensions or event escape.

SURROUND-003: Missing previous or next creates no placeholder link. When both are
absent, a visible named empty message replaces the links. label and emptyLabel are
optional bounded overrides of named core defaults. newWindow uses noopener/noreferrer.
Enabled destinations preserve native keyboard, copy-link and modified-click behavior.

SURROUND-004: Each component owns its schema-derived Props, TSX facade, adapter,
reference example and tests. Generative transport uses the same closed objects as a
leaf node; it contains no executable callback or implicit application state.

Acceptance: strict schema/type failures for native props and unsafe links; DOM and SSR
checks for empty/one/two destinations and safe new windows; a packed TSX consumer;
browser navigation and focus at 240/320/768/1440 widths, both templates, scoped RTL,
200% text and unbroken labels. Every executable owned file must have 100% coverage in
all four metrics. Combined acceptance remains the integrating agent's responsibility.

Primary reference: https://ui.nuxt.com/docs/components/content-surround, retrieved
2026-10-29. Nuxt Content database lookup is replaced by explicit validated neighbors.
Raw styling and tag overrides are intentionally unavailable.
