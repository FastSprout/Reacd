# Agent B Select enterprise extension

Date: 2026-10-29. Source: fork-b. Scope: SELECT-001 through SELECT-007. This is verified
snapshot work; root acceptance remains a separate parent gate.

Preserve default single selection and add explicit multiple readonly-array mode. Closed
catalogs, descriptions, empty state, loading/readOnly protection, clear action, native
required validation and canonical repeated FormData are covered. A host may decline
writes. Previously selected disabled options remain canonical; new disabled choices,
unknown keys and duplicates cannot be requested. Callbacks receive one logical value.

The installed Base UI Select owns keyboard/typeahead and multiple interaction. The
legacy Radix ShadcnSelectContent remains unchanged for frozen ColorModeSelect and
LocaleSelect. New ShadcnBaseSelectContent uses its own popup class and explicit token
palette, portal scope and direction. No SDK types, styling props or HTML enter TSX apps.

Selection foundation is frozen separately in selection-foundation. This batch imports
its DTOs and guards but does not alter shared state infrastructure. Parent registered
own selectNodeSchema/selectNodeBindings, BoundSelect, Select CSS and SelectExample.
Single transport binds text, multiple binds selection, and read forces readOnly. Catalog
constraints reject external unknown writes. SSR uses isolated registries.

Red acceptance: select-schema-before.log, select-adapter-before.log and
select-change-before.log. The final combined run passes 55 tests across 21 files in
.cache/forms-owned-coverage.log. All 11 executable owned files reach 100% in all four
metrics: 103 statements, 118 branches, 31 functions and 94 lines. Report:
.cache/coverage-forms-owned/coverage-summary.json. Global unrelated unexercised files
still exit 1 under unchanged thresholds; no coverage paths were hidden.

Four-project types pass in .cache/forms-owned-final-types.log. No-ignore typed lint
passes with zero diagnostics across 56 combined owned files in
.cache/forms-owned-final-lint.json. Three test-only type mistakes were corrected without
runtime changes; the affected six tests pass in forms-test-typing-regressions.log.

Official build passes in .cache/forms-final-build.log. All 54 Chromium scenarios pass in
.cache/forms-final-browser.log, including ten Select scenarios: both templates,
240/360/768/1440, 200% text, RTL, long popup labels, containment, native data and
readonly. Inspected .cache/select-{compact,spacious}-final.png. Compact uses 360px, 200%
and RTL; intentional two-line ellipsis retains full labels in the popup. Browser
validation is independent of schema correctness. Work remains local; no dependency or
vendor changes. Maintained owned files satisfy 300 lines, 88 columns and two spaces.
Generated cache artifacts retain tool formats. Legacy callback-boundary delta is
superseded only for Select; its independent Toggle changes remain intact.
