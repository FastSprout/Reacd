# Composed Form2 controls and document foundation

Date: 2026-10-29. Source: fork-a. Complete combined acceptance remains pending.

The immutable Form2 candidate contributes ColorPicker, FileUpload and the revised
Checkbox, Select and Slider contracts. It adds numberRange and fileList while
preserving panelLayout, temporal and existing state kinds. All 167 payload hashes
matched; 166 files were copied against exact baselines and one was identical.
Current InputMenu registration, ref ownership and focus repairs remain intact.

The separate 25-path pure Editor foundation adds richDocument state and bounded
portable document data, including the descriptor-based array preflight correction.
It does not implement or expose the native editor UI or add editor dependencies.

## Verification and corrections

The first Form2 run passed all 272 tests but missed older FormNodeView branches in
its narrow coverage scope. Existing complete Form/FormField/InputMenu transport
tests were added. The composed run passes 297 tests across 59 files, with all 68
executable files at 100% in all metrics and 12 empty modules. Totals: 734 statements,
651 branches, 178 functions and 643 lines. No thresholds or exclusions changed.

The older generative slider test now supplies the same nonzero DOM geometry used
by its SDK adapter acceptance. The workbench unit test opens Select by keyboard
and awaits the named option. Its original state, progress and table assertions
remain intact; both affected files pass all 12 tests.

Typed lint found a control-character regex and a FileReader test alias of this.
The filename regex uses the equivalent Unicode Cc category for the C0/C1 set,
retaining separate line-separator and path restrictions. The test inspects a
validated native FileReader from mock contexts. Nine filename/reader tests pass;
the changed schema is 100% in all metrics. Printable Unicode names remain accepted,
and C0/C1 boundaries and Unicode line separators remain rejected.

Four strict type projects, source policy, schema/examples, production build,
packed consumer, typed lint and strict MkDocs pass. The unchanged bundle budget
passes at 13 chunks, 1678266 total JS bytes, 1453802 initial static bytes and a
432888-byte largest chunk. The last browser fixes only change test selectors.

The production run passes 71 of 73 cases with one worker. Its two failures are
older workbench selectors: the slider name is the declared Volume without a colon,
and multiple tables now require the Example inventory caption. Both full journeys
pass after those selector corrections. Runtime code is unchanged between runs.
All 50 control cases, four module-loading cases and 19 workbench cases are verified,
including real pointer Empty/Loading/Error/Ready transitions, SSR-delayed chunks,
200% narrow layouts, RTL, keyboard and protected overflow-negative detection.
Both original and rerun logs are retained; no timeout was increased.

Full combined tests, browsers and the independent Standards/Spec review still
remain required. This record does not mark B inventory entries Verified.
