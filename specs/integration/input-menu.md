# InputMenu delivery

Status: immutable integration candidate on 2026-10-29. Final current-source
package acceptance is pending coordinated parent checks. This delivery contains
InputMenu only, not SelectMenu.

## Baseline and dependencies

Workspace: `.cache/workspaces/a-form-menus/`. Source starts from immutable
`fork-a/.cache/batches/agent-a-final/files/` plus `agent-a-accepted` metadata.
The reviewed package/lock come from `.cache/installations/fork-a-b02/`.
Dependencies link to that stable installation; nothing was installed through it.

B's immutable `fork-b/.cache/batches/selection-foundation/manifest.json` is a
prerequisite. Its pure core/schema files were imported after verifying every
payload hash, then left unchanged. `selection-dependency.json` lists those paths.
They are dependency-owned, not duplicated in this InputMenu delivery.
The parent's full foundation import owns any generic selection-state change.

## Contract

Closed named Props, canonical options and controlled free text; no persistent
selected key or multiple mode. Suggestions request their label as text.
Optional TSX preflight receives exactly readonly `{ value, text }`; false stops
the later text request and close. Text/disclosure callbacks receive one logical
argument; false vetoes, boolean/void is accepted, invalid returns/throws report
an error. Host-rejected values never become submitted text.

JSON binds text value with explicit read/readWrite access. Optional open is a
readWrite boolean reference. It has no suggestion preflight action or separate
option identity state and changes no global action context. Opaque canonical
keys, including numeric-looking strings, remain valid; edge whitespace fails.
Loading/error/empty results, disabled/readOnly, native required read-only forms,
IME guards, scoped portals and controlled disclosure have acceptance coverage.

## Verification

Requirements and initial failing tests preceded production modules. The first
red log retains missing-module/undefined-export failures. Subsequent failures
found initially-open label association and delayed popup hiding; both corrected.

Final exact-source scoped coverage: 28 tests in 11 files. Fourteen owned
runtime files have 100% statements, branches, functions and lines:
164/115/48/147 respectively.
Three barrels/type-only files have no executable statements. Scope includes
the runnable documentation example; no owned runtime path is excluded.

Current-source strict four-project types, explicit typed lint, source policy,
generated schema/example freshness, build/bundle budgets, strict MkDocs and
nine production browser cases pass. Packed consumer passed before the final
copy-only delta; current-source package acceptance remains pending. The consumer
checks positive TSX, negative native/style/value/private imports, runtime SSR/state
and package exports. No public subpath was added.

Nine production Chromium cases pass on port 5197, one worker, using the actual
built demo. Both templates pass at 240, 360 and 1440 pixels with long labels,
200% text and scoped RTL. Cases cover canonical FormData, required read-only
focus, disabled omission, veto, nested Modal popup and inner-first Escape, plus
composition Enter 13/legacy 229 and final text commit. Browser evidence is
distinct from structural/schema validity.

Antislop checks: closed TSX examples compile; controls have tested logical
actions, labels, keyboard/focus and status feedback. Production geometry tests
show contained text/popups in both templates and scoped RTL. Styling reuses
template colors/tokens with no new visual asset, motion or product claim.

## Pending coordinated gates

The last runtime delta moved two unchanged announcement strings to named core
constants, changing the policy, main adapter and popup adapter only. It adds
no new branch or API. That delta is covered by current build/types/browser
proof, but the last full coverage attempt had one unchanged documentation
case exceed its existing five-second limit under severe host contention.
The other 27 tests passed. No timeout or threshold was changed. Its failure
log is retained. The subsequent unchanged run passed all 28 tests with exact-
source all-four 100% coverage in 14.05 seconds; it finished before the parent
resource stop was processed. No own heavy process remained to terminate.

A package run overlapped this worker's build and packed before dist/styles.css
was recreated. Its ENOENT log is retained as an orchestration error. Earlier
canonical-source package acceptance passed; the current package must be
checked after the combined build. This candidate claims exact-source owned
coverage, but not current package acceptance. The parent will queue the packed
consumer and combined checks under the global heavy lock.

## Integration

Frozen payload: `.cache/batches/input-menu-candidate/` in this workspace. Exact new and
modified paths, baseline hashes, payload hashes and aggregate patch are listed
there. Merge existing aggregate files by intent; do not replace the parent's
catalog, dispatchers, schema binding switch, registry, styles or documentation
navigation wholesale. The transport schema is generated and must be regenerated
after the combined merge. Helpers are exclusively owned by this worker.

Local cache/worker/browser configuration, dependency symlinks, builds, coverage,
site and logs are not source payload. Generated manifest/patch/coverage evidence
retains tool-required formatting. Maintained source/spec/docs obey 300 lines,
88 columns and two-space indentation. No live B/fork A/root source, commit,
push, publication, deployment or DNS was changed.
