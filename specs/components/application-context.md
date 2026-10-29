# Application context components

Status: implemented locally; browser and all-project checks remain pending.

APP-001: App declares reading direction and content language. It propagates direction to
native content, Base UI and Radix controls. It contains safe reacd children and lays out
application shells vertically. Jotai state and adapter selection remain responsibilities
of the outer ReacdProvider.

THEME-001: Theme scopes a validated design template to safe descendant content,
including descendant portals. It accepts optional closed defaults for layout spacing,
Text role/weight/lineLimit, Button intent and Separator presentation. Explicit
descendant properties override defaults. Unknown defaults, callbacks, native classes and
CSS overrides are rejected.

ERROR-001: Error displays a bounded HTTP error status, nonempty title, supporting
message, safe leading/actions/body content and an optional validated recovery link. It
never leaks an unvalidated exception object or stack trace. It exposes a labeled error
region and preserves every supplied recovery action.

## Acceptance

- App permits ltr/rtl and valid language tags; invalid direction and native application
  tags fail strict validation.
- Theme rejects invalid contrast and arbitrary property names, inherits the active
  appearance when no template is supplied, and preserves child state.
- Theme defaults apply to supported controls and explicit props take priority.
- Error rejects unsafe recovery links and invalid HTTP codes; SSR and DOM output
  preserve the title, status and recovery target.
- Public examples compile and run through an isolated ReacdProvider.
- Per-file runtime coverage is 100%; browser verification remains independent of
  structural schema checks.

## Primary references

- https://ui.nuxt.com/docs/components/app
- https://ui.nuxt.com/docs/components/error
- https://ui.nuxt.com/docs/components/theme

Retrieved 2026-10-29. App host configuration which would expose raw DOM portal targets,
arbitrary provider options or runtime nonces remains trusted provider configuration.
Theme replaces raw per-slot CSS overrides with design tokens and closed behavioral
defaults. These are deliberate reacd API adaptations.

## Verification

- Direction regressions exercise actual portaled Select direction, Slider arrow behavior
  and Tabs navigation under RTL and a nested LTR override. All four App adapter tests
  pass. The trusted provider dependency is pinned directly.
- Theme applies the scoped canvas background as well as typography and tokens. Its
  browser test asserts the compact canvas's actual computed background.

- Focused context-only coverage: 15 files, 25 tests passed; all 17 production files in
  that scope have 100% statements, branches, functions and lines.
- Latest combined eight-component scope: 38 test files, 71 tests passed; 48 production
  files have 100% coverage in all four metrics. This includes theme diagnostics, nested
  defaults, portal variable context, generative action traversal and SSR, public types
  and compiled interactive examples.
- Reports are local in .cache/coverage/layout-current/coverage-summary.json.
- Browser suite demo/e2e/application-context.spec.ts covers both templates, four
  viewport widths and 200% text, controlled local actions, single-main composition,
  language/direction attributes and safe recovery links. Execution remains pending
  coordinated integration verification.
