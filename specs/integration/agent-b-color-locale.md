# Agent B Color Mode and LocaleSelect delivery

Source: fork-b, 2026-10-29. Six assigned entries are implemented with closed TSX APIs,
per-module inferred Props, shadcn adapters and optional generative bindings. Acceptance
here is scoped to this immutable delivery; complete A+B integration is still pending.

COLOR-001 through COLOR-008 define controlled light/dark/system preference, explicit
resolved mode for TSX assets and host-applied templates. Five components are exported:
ColorModeButton, ColorModeSwitch, ColorModeSelect, ColorModeAvatar and ColorModeImage.
useColorMode uses the application-scoped Jotai store even inside a foreign provider.
useSystemColorMode accepts an explicit SSR fallback and cleans up device listeners.
No global document mutation or implicit global store is introduced. The convenience
darkTemplateVariants registry adds two validated palettes without changing base keys.

LocaleSelect accepts canonical unique BCP47 codes, host-authored English labels and a
controlled selected value. Existing text bindings support read and readWrite with
catalog membership constraints. Locale selection does not change global language;
the host explicitly applies App language/direction. ReadOnly allows inspection while
preventing edits. Native form values and scoped portals retain host behavior.

## Evidence

Color Mode: 25 tests across 18 files pass; all 34 executable owned files have 100%
statements, branches, functions and lines. Totals: 116 statements, 85 branches,
37 functions and 107 lines. Evidence: .cache/color-mode-final-coverage.log and
.cache/color-mode-final-coverage/coverage-summary.json. Sixteen type/barrel files have
no executable statements. Adapter/type tests are colocated per component.

LocaleSelect: 12 tests across six files pass; all eight owned runtime files have 100%
in every metric: 43 statements, 20 branches, 17 functions and 37 lines. Evidence:
.cache/locale-owned-coverage.log and its coverage-summary.json. Initial coverage using
the global include list also reported unrelated unexercised files; that run is not the
accepted focused coverage evidence.

The final settled-contrast regression exposed a real dark outline-label defect before
the CSS correction: .cache/color-mode-contrast-stable-before.log. The final production
build passed in .cache/color-mode-final-build.log. All 12 strengthened Color Mode
Chromium cases pass in .cache/color-mode-browser-contrast-final.log. Checks cover both
templates, widths 240/360/768/1440px, 200% text, RTL, keyboard, protected controls,
retained drafts, failed assets, live device preference and settled text contrast.
Earlier screenshots captured the old defect and are not final visual evidence.

All ten LocaleSelect Chromium cases pass within the 22-case run recorded at
.cache/color-locale-browser-final.log. Its Color Mode cases predate the strengthened
contrast assertion; use the later dedicated 12-case run for that requirement. Locale
coverage includes both templates, narrow/RTL/200%, keyboard/typeahead, protection and
SSR/hydration. Chromium evidence does not assert other browser engines are verified.

After Select/Slider integration, production TypeScript passes in
.cache/b-controls-production-types.log. The earlier family-specific no-ignore typed lint
passed in .cache/color-locale-reorder-lint.log. Full combined gates remain A-owned.
No dependency, state-kind, provider-contract or remote operation belongs to this batch.

## Aggregate proposals

Merge additions deliberately, preserving A's own entries. Add the six names/schema/Props
exports to component catalog/barrels, compose colorModeEntries and LocaleSelect in the
registry, add exhaustive fixtures and route their own leaf schemas/binding contracts.
Color Mode dispatch uses ColorModeNodeView; locale dispatch uses BoundLocaleSelect.
Import both owned stylesheets, mount the examples and add six MkDocs reference entries.
Export useColorMode, useSystemColorMode and darkTemplateVariants from the public barrel.
The immutable shared-proposals directory is reference material, never a replacement for
A's aggregate files. No executable runtime is excluded from coverage.
