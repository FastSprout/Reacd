# SelectMenu delivery ledger

Status: scoped implementation verified; combined parent acceptance is pending.
Date: 2026-10-29. All changes remain in isolated a-form-menus.

## Baseline and ownership

Use immutable A final plus accepted metadata, then InputMenu candidate and its
single-line/focus correction overlay. The parent owns subsequent InputMenu Clear
repairs; this delivery must not overwrite those files.

Import B's immutable selection-foundation before these sources. Its complete
option catalog, opaque keys, single/multiple factories and interaction rules are
reused unchanged. Generic selection state capacity is a prerequisite. The exact
dependency hashes are recorded in .cache/selection-dependency.json.
The exact frozen form-controls FieldMetadata module and its tests are also dependency
owned; .cache/field-metadata-dependency.json records their hashes. No B module
is edited.

SelectMenu owns its core policy, schema, named Props, component, private adapter,
generative bindings, styles, colocated tests, documentation, runnable example and
browser conformance. No other component-owned production module is changed.

## Aggregate proposals

- Export SelectMenu and SelectMenuProps from components/index.ts.
- Register its catalog name/schema and shadcn field implementation.
- Add its generative leaf schema and selectMenuBindings dispatch.
- Dispatch BoundSelectMenu from the generative node renderer.
- Import select-menu.css from the trusted stylesheet entry.
- Add the runnable Fields example, its catalog conformance fixture, MkDocs
  navigation and public component index link.
- Regenerate generative.schema.json after the combined merge.

Shared files must be merged by intent against the current parent snapshot.
Never replace a combined aggregate with this older isolated copy.

## Contract decisions

TSX is primary. Mode single defaults to an opaque string or ''. Explicit
multiple uses a readonly unique string array. Empty catalogs are valid. Required
validates form submission; it permits empty editing values. Existing disabled
selections can be removed, cleared or replaced, and remain serialized until
the host accepts a different value. New disabled selections are rejected.

Query is separate single-line text. It persists across selection and disclosure.
ReadOnly locks selection; queryReadOnly independently protects search. Optional
query and open channels each require their matching callback. All request
callbacks receive one logical argument and synchronously return boolean or void.
False vetoes. Invalid returns and throws produce visible associated feedback.

JSON reuses text/selection/boolean state kinds. Optional query uses a different
text key; disclosure requires a writable boolean reference. Membership and text
constraints protect initial data, host writes and transactions atomically.
No new action-context API, public SDK events, HTML or styling props are added.

## Verification record

Acceptance tests preceded implementation. Retained-order and trigger-IME
regressions retain their failing and passing evidence. Production noEmit passed.
The first complete types attempt preceded declaration emission and found only
the stale package self-reference export; it is retained as artifact ordering.
The final gate must build declarations first without aliases or suppressions.

Focused controlled/IME, native forms, hydration, state isolation, atomic query
writes, documentation, access/status and schema checks have passed. The first
complete scope passed 52 tests with all-four 100% in 12 executable files.
The first production browser pass found one controlled close-focus failure:
11 cases passed and JSON reference rebinding lost focus. Explicit official
Combobox.Popup finalFocus restored the trigger. A focused browser regression
passed; an additional Space/Tab browser case passed without trapping focus.
The final matrix passed all 13 production Chromium cases with one worker.
The additional case verifies Space editing and Tab traversal after the focus fix.

Final build/declarations, four-project strict types, explicit typed lint, source
policy, schema/example freshness, packed consumer and strict MkDocs passed.
The final coverage refresh passed 52 tests in 17 suites. All 12 executable files
have 100% statements, branches, functions and lines: 223/193/68/201 respectively.
Three type/barrel files contain no executable code. Imported foundation and
FieldMetadata modules are dependency owned and are not removed from coverage
through exclusions. The parent must run combined checks after aggregate merges.
The generic lint command found no files from this hidden snapshot; the explicit
affected-file invocation applied identical rules and passed. Its output is kept.
The browser matrix covers both templates, 240/360/1440 widths, RTL, 200% text, long
labels, native forms, disabled history, vetoes, inner-first Escape, IME and
externally controlled close focus. Port 5211 and one worker are reserved locally.

Generated manifests, patches, reports and browser traces retain tool formats.
Maintained files follow the 300-line, 88-column and two-space source rules.
No thresholds, timeouts or runtime coverage exclusions are changed.
