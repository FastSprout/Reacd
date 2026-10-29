# Editor inherited metadata correction

Date: 2026-10-29. Status: isolated correction verified; complete combined
acceptance and final independent Standards/Spec review remain coordinator-owned.

## Baseline, requirement and actual defect

Fresh a-editor-field-review copied only the 3,310 hash-verified paths from frozen
final-review-source/checkpoint. Stable reviewed fork-a-editor dependencies are
linked; no install occurred. No root/fork-a/fork-b live source was edited.
The exact baseline manifest and per-file hashes are recorded in the overlay.

EDITOR-NATIVE-008/009 preceded acceptance and implementation. The old session
combined only own disabled/readonly props and PortalActive. A native disabled
fieldset did not protect its contenteditable descendant. In a genuine ordinary
production browser baseline, public FormField disabled with Editor disabled=false
accepted mouse focus and keyboard typing: the controlled document became
"Field noteUnexpected". Its native textbox still exposed contenteditable=true,
aria-disabled=false and tabindex=0. The real failure log/context are retained.

Four public TSX acceptance cases also failed before the correction: field disabled
safety, inherited feedback and AuthForm loading/disabled protection. The first
fixture draft omitted FormField's existing required name; that diagnostic is
labelled separately, and valid named-field reds were re-recorded against exact
baseline runtime before applying the fix. FormField help intentionally yields to
error, so combined guidance acceptance uses its always-visible description. No
FormField behavior or assertion threshold was weakened to obtain green tests.

## Narrow correction

useEditorSession resolves the unchanged trusted useFieldMetadata contract and
normalizes the existing disabled property before SDK initialization, edit and
selection publication, paste/drop handling, native attributes and setEditable.
It returns those private effective properties to EditorSurface, which creates
its logical command port from the same normalized input. Toolbar/menu/drop ports
also retain the existing protectedView/ready guards. Parent false cannot reenable
inherited disabled; Portal inactivity and existing readonly remain independent.

Native aria-describedby merges inherited description/error IDs with local guidance
without duplicates. Controlled outer error sets aria-invalid; FormField retains
ownership of its alert. No duplicate alert, copied error state, public name,
required, FormData contract, raw SDK prop, sizing option or style is introduced.
The shared metadata helper is byte-identical with SHA-256:
b766fdea3cff9d212764a2ea1d9aca91181347a2eeadd3164f0e4e8282f58078.

## Verification

All 120 relevant Editor tests in 39 files pass, including six new public/native,
controlled-selection/context and SSR/Jotai-isolation cases. Both changed runtime
files have 100% statements, branches, functions and lines: 84 statements,
84 branches, 15 functions and 74 lines. No threshold, timeout or exclusion changed.
The existing JSDOM scrollBy diagnostic remains visible in scoped output; layout
claims instead use the native Chromium proof below.

Production noEmit, all four strict TS7 projects, explicit no-ignore typed lint,
source policy, official declaration/package/demo build, packed TSX/negative
fixtures/SSR/state/exports and strict MkDocs pass. The component reference explains
inherited protection without adding new public props or changing its example.

Four production Chromium scenarios pass with one worker on port 5211, covering
both templates. Ordinary physical mouse/keyboard typing cannot mutate the blocked
field or AuthForm loading/disabled editor. Reenable and external host replacement
are quiet; readonly remains effective; outer feedback clears without duplicate
alerts; independent controls remain editable. Native command/drag controls receive
disabled attributes, and disabling an open suggestion menu releases it. Controlled
selection/value requests remain guarded. Auth submission still works after resume.

The maintained fixture uses public TSX and isolated Jotai state under test-support.
Its view, DOM bootstrap, HTML route, browser suite and ordinary fourth MPA input
are all part of this delivery. No private unshipped build is required. All four
HTML entries and manifest records are verified. Fixed bundle acceptance passes:
20 JavaScript chunks, 2,246,304 total bytes, 1,996,989 initial-static bytes and
449,923 largest-chunk bytes, below the unchanged 500,000-byte limit. Existing
SDK vendor groups and lazy graph boundaries remain unchanged.

## Scope-specific design gate

- Hard gate PASS: real blocked/reenabled typing, command states, menu cleanup,
  error descriptions and independent controls pass in both templates.
- Purpose gate PASS: no decorative assets, colors, typography or motion added.
- Liveliness PASS: approved technical E1/R2/M1 direction is preserved; the
  separate route is explicitly conformance scaffolding.
- Craft PASS: all six added tests and four actual browser cases retain host
  authority, meaningful native state and exact existing callback contracts.

## Applying the overlay

Use .cache/batches/editor-field-metadata/manifest.json, files/, diffs/ and evidence/.
The fifteen-path overlay has eight new files and seven modifications, including
the two runtime files. Keep the metadata dependency unchanged. Merge only the
fourth MPA input into the coordinator's current Vite config, preserving all other
entries, vendor groups and budgets. The intent patch is separate under
shared-proposals/vite.config.ts.patch. Do not replace newer whole shared config.
Merge the short Editor reference paragraph while preserving preview metadata.

BROWSER-FIXTURE-006 and BUNDLE-011 are additive conformance requirements, not public
API. Preserve other workers' later fixture inputs and spec additions. Generic
Form, Tabs, nested-boundary and Chat loading corrections remain separately owned.
No library schema/export, CSS, package or coverage configuration changes here.
Maintained payload paths satisfy 300 lines/88 columns/two-space rules. Generated
logs/manifests/build/coverage artifacts retain tool formats. No own heavy job or
server remains active. All work stays local without commit, push, publication,
deployment or DNS changes.
