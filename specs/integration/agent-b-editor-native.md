# Agent B: native Editor and menus

## Delivery boundary

This is a local component-owned delivery from the B snapshot. Its immutable
manifest is `.cache/batches/editor-native/manifest.json`. No commit, push,
publication, deployment, or DNS change is part of this delivery.

The manifest lists new paths and their SHA-256 hashes. Existing root aggregate
files are not replaced. The coordinator owns catalog, public root exports,
central registry, recursive transport dispatch, theme integration, generated
schema, demo mounts, MkDocs navigation, and final integrated acceptance.

This batch provides Editor, EditorToolbar, EditorSuggestionMenu,
EditorMentionMenu, and EditorEmojiMenu. EditorDragHandle is a separate frozen
prerequisite. All six entries depend on the same closed document contract.

## Requirements and public behavior

- EDITOR-001 through EDITOR-010 define closed TSX authoring and document data.
- EDITOR-NATIVE-001 through EDITOR-NATIVE-007 define native editing behavior.
- EDITOR-MENU-001 through EDITOR-MENU-009 define local and remote menus.
- Application code receives no SDK instance, HTML renderer, DOM event, styling
  escape hatch, or arbitrary command callback.
- The private-selection Editor variant accepts `value` and `onValueChange`.
- The controlled-selection variant accepts `value`, `selection`, and one
  `onEditChange` callback receiving an immutable coherent EditorEdit snapshot.
- Mixed callback variants are rejected by runtime schemas and TypeScript.
- Host Jotai state remains authoritative. Rejected document or selection
  proposals reconcile without publishing a partially valid host snapshot.
- Toolbar commands, link targets, suggestion catalogs, mention items, and emoji
  values are bounded closed inputs. SDK classes remain private.
- Local catalogs support keyboard navigation, disabled options, query matching,
  composition guards, explicit dismissal, and atomic insertion.
- Remote mentions use correlated request keys and queries. Matching ready items
  are authoritative. Stale replies preserve accepted current results; a fresh
  request shows loading until a matching response arrives.
- JSON transport supports literal local menu catalogs. Remote lookup remains a
  TSX host capability; it is not executable JSON.
- SDK startup faults are contained per Editor. Retry mounts the latest host
  value without replacing neighboring editors or application stores.

## Frozen prerequisites

Apply component-owned prerequisites deliberately before this batch:

1. `editor-foundation`, `editor-command-contract`, and `editor-codec`.
2. `editor-identity-reorder`, `editor-selection-mapping`, `editor-drop`, and
   `editor-plain-paste`.
3. `editor-dependencies`, with the coordinator-owned package changes.
4. `editor-generative`, `editor-docs-integration`, and `editor-drag-handle`.
5. `mention-lookup`, `editor-mention-lookup-example`, and
   `editor-session-conformance`.
6. `editor-menu-conformance`, `editor-wrapping-late`, and
   `editor-menu-late-keys` for the additional acceptance tests.
7. `editor-startup-browser` and `editor-startup-caret` browser acceptance.

The formatting-only modified paths in editor-wrapping-late are already present
in this batch's current source copies. Do not overwrite current native source
with an older formatting snapshot. Its newly introduced acceptance test remains
a separate prerequisite. The late-key delta applies to that test in order.

Root shared integration proposals are separate from these component files.
The coordinator explicitly owns editor-layout, editor-variables, the main
Editor registry entry, grouped public fixtures, demo mounts, menu node dispatch,
and typography browser acceptance. Those paths are excluded here.

## Verification evidence

The following are measured scoped results, not a declaration that all root
checks have completed:

- `.cache/editor-all-latest.log`: 161 tests across 64 files passed before the
  final additional menu conformance tests.
- `.cache/b-final-coverage-corrected/coverage-summary.json`: the earlier whole-B
  run measured every executable native-owned file at 100% in all four metrics,
  except the subsequently completed menu-plugin branches. That whole run had
  three unrelated example-test failures; it was not a passing repository gate.
- `.cache/menu-final-proof.log`: all 34 menu tests across nine files passed.
- `.cache/menu-final-proof/coverage-summary.json`: each of the six menu runtime
  files reached 100% statement, branch, function, and line coverage.
- `.cache/editor-native-coverage.json` records the corresponding owned-file
  counters from those two reports: 43 executable files and 16 empty type/barrel
  modules. Executable totals are 479 statements, 348 branches, 138 functions,
  and 423 lines, all covered. This is a report index, not a merged V8 counter
  file or a replacement for the final whole-repository coverage run.
- `.cache/editor-final-types.log`: the coordinator's four-project typecheck
  passed with current public declarations.
- `.cache/editor-final-owned-policy.log`: maintained source policy passed.
- The coordinator reported schema/example freshness and strict MkDocs passing.
- `.cache/editor-final-build.log`: the official B production build passed;
  its largest chunk was 386095 bytes under the unchanged bundle limit.

Additional genuine regressions and their fixes are retained:

- `.cache/editor-rejected-split-before.log`: separate callbacks could publish
  a selection referencing a document the host rejected; atomic snapshots fix it.
- `.cache/editor-atomic-types-before.log`: mixed public variants compiled before
  explicit forbidden-property typing was added.
- `.cache/editor-store-before.log` and
  `.cache/editor-store-revocation-before.log`: stale ownership and rejected
  replacement could route callbacks through the previous menu lease.
- `.cache/menu-port-conformance.log`: removing one plugin cleared another
  active trigger's ARIA ownership during SDK view recreation.
- `.cache/menu-late-keys-before.log`: retained callbacks consumed navigation
  keys after disposal. Current callbacks reject disposed ownership.
- `.cache/editor-template-browser-before.log`: a valid large-spacing template
  overflowed the narrow Editor. Owned padding now uses the named template clamp.
- `.cache/editor-startup-browser-before.log`: an actual observer startup fault
  escaped to the whole lazy catalog view before the local boundary existed.

The source change for the last disposed-key regression postdates the earlier
official build. A fresh final build and Editor browser run remain necessary.
Earlier real-browser acceptance exercised native editing, clipboard/history,
atomic host state, menus, remote replies, drag, startup recovery, typography,
RTL, 200% text, narrow widths, and the valid custom-template clamp. Browser
proof is independent of schema validation.

One caret hypothesis did not reproduce a production defect:
`.cache/editor-caret-stability-before.log` passed against unchanged session
code. Its DOM-selection regression remains; no speculative session rewrite was
made. Browser shortcut and startup readiness corrections are test harness
corrections, not claimed runtime fixes.

## Remaining integrated acceptance

The coordinator is running the final whole-B coverage and broad Chromium
checks. A fresh final build, final Editor browser matrix, package/lint gates,
and A's deliberate integration into the root remain coordinator-owned.
Do not mark root inventory entries Verified from this scoped manifest alone.

Generated manifests, coverage JSON, logs, temporary configs, browser artifacts,
and build output retain tool formats and are excluded from maintained source
line limits. Runtime coverage thresholds and source exclusions are unchanged.
