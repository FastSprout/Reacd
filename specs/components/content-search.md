# Content search

Status: specified for isolated Agent A implementation.

SEARCH-001: ContentSearch composes the closed CommandPalette inside a controlled Modal.
Required title, label, query/onQueryChange, groups and open/onOpenChange describe
content and state. Optional description, triggerLabel, closeLabel, footer and
closeOnSelect are logical content/behavior. Palette filtering, statuses, disabled
and messages retain the
existing command contract. No dimensions, raw events, HTML or CSS are exposed.

SEARCH-002: Selection first asks the host onSelect callback. False vetoes both closing
and command execution. Invalid non-boolean/non-void results fail closed with a visible
diagnostic. Accepted selection closes by default; closeOnSelect=false preserves the
dialog. Query and field state are retained through dismissal. Escape belongs to Modal;
focus enters the query and returns to the opener. Footer feedback stays inside the
dialog rather than behind its inert background.

SEARCH-003: ContentSearchButton is a distinct named component with label,
open/onOpenChange and optional disabled. Its native button announces dialog expansion
and requests open=true with no native event argument. It does not invent a global
keyboard shortcut or claim an unregistered shortcut is active.

SEARCH-004: Generative search has independent boolean open and text query bindings,
optional text selection, registered item actions and safe footer arrays. Selected-key
publication and automatic close use one transaction. If either write fails, neither
state nor target changes, and feedback remains in the open dialog. SearchButton binds
the same boolean key explicitly. Isolated SSR/request stores remain separate.

Acceptance requires failing callback-veto and state-transaction tests, strict schemas
and consumer types, keyboard/pointer/IME/focus behavior, every status, retained data,
SSR/hydration, public compiled examples, packed use and 100% per-file runtime coverage.
Actual browser checks cover both templates, 240/320/768/1440 widths, scoped RTL,
200% text, reduced height and nested overlays. Schema validity is not browser evidence.

SEARCH-005: The shared Modal captures its scoped direction onto its portal and popup.
An App direction may differ from the document direction and may change while open.
Nested result menus retain that direction without changing the outer application.

Primary references: https://ui.nuxt.com/docs/components/content-search and
https://ui.nuxt.com/docs/components/content-search-button. Nuxt Content database/router
lookups become explicit host-provided command groups. The shared CommandPalette matcher
and Modal focus/portal policies are reused, rather than replaced by a second engine.
