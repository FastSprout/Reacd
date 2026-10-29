# Agent B Checkbox enterprise extension

Date: 2026-10-29. Source: fork-b. Scope: CHECKBOX-001 through CHECKBOX-006. This is
verified snapshot work; root acceptance remains a separate parent gate.

Preserve checked:boolean and the exact boolean callback. Add controlled mixed state,
description, logical name/value, required and readOnly. A mixed checkbox neither
satisfies required nor serializes checked data. Activation proposes true; the host owns
clearing mixed state. Read-only retains focus and canonical data. Disabled omits data.
FormField metadata is inherited without cloning child labels or re-enabling disabled.

Own optional transport has checked boolean read/readWrite plus literal/read mixed state.
BoundCheckbox preserves reader isolation and host-controlled mixed state. JSON state
validation is distinct from browser rendering correctness.

Parent already registered own node/binding schemas, BoundCheckbox, CSS and the compiled
CheckboxExample. Those shared files are not included in this component freeze. No new
dependency or vendor-source change is required.

Red acceptance: .cache/checkbox-before.log and checkbox-binding-before.log. The final
combined owned run passes 55 tests across 21 files in .cache/forms-owned-coverage.log.
Every six executable owned files reach 100% in all four metrics: 50 statements, 56
branches, 12 functions and 47 lines. Report:
.cache/coverage-forms-owned/coverage-summary.json. The unchanged global coverage gates
also report unrelated unexercised files and exit 1; no thresholds or paths were changed.

Four-project types pass in .cache/forms-owned-final-types.log. No-ignore typed lint
passes with zero diagnostics across 56 combined owned files in
.cache/forms-owned-final-lint.json. Official production build passes in
.cache/forms-final-build.log. All 54 Chromium scenarios pass in
.cache/forms-final-browser.log, including ten Checkbox scenarios across both templates,
240/360/768/1440, 200% text, RTL, native validation, mixed/readonly and FormData.

Inspected .cache/checkbox-{compact,spacious}-final.png. Compact uses 360px, 200% and
RTL; labels and controls wrap without overlap. Generated cache reports/screenshots
retain tool formats. Maintained owned files satisfy 300 lines, 88 columns and two
spaces. All work stays local. No commits, remote writes, publication or DNS changes.
