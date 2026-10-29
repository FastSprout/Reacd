# Agent B: ColorPicker and FileUpload

Status: ready for local Agent A integration. Scoped unit, SSR, production browser,
strict lint and all four TypeScript projects pass. Agent A owns final root inventory
verification; this snapshot does not complete the entire enterprise implementation.

## Scope and requirements

Only fork-b is modified. This batch implements COLOR-001 through COLOR-007 and
UPLOAD-001 through UPLOAD-007. TSX declarations are primary. Both controls have closed
per-component props and optional generative state references. No dependencies were
added. Existing installed React Aria primitives are private ColorPicker machinery.

ColorPicker requires mode rgb/rgba, label, canonical value and onValueChange. Optional
presets are labelled readonly DTOs. Area, hue, alpha, hex, presets and actual App RTL
request canonical strings. Public callbacks never receive SDK objects or browser events.
A private achromatic hue cache cannot accept a rejected different canonical value.

FileUpload provides real content DTOs, not a metadata facade. Multiple mode appends an
atomic batch; single mode replaces. Ten files, eight MiB per file and sixteen MiB total
are named policy caps. Lower maxFiles and closed MIME groups are optional. Native
readers start only after batch budgets and metadata pass. Cancellation, host changes,
protection and unmount invalidate pending work. The host owns persistence and network
IO.

The approved fileList state kind is integrated separately by the B coordinator and uses
fileListValueSchema. No new ColorPicker kind exists; it uses bounded text state. The
initial generative document budget remains one million characters. Large runtime file
updates do not justify raising that initial budget.

## Integration

Public exports: ColorPicker, ColorPickerProps, FileUpload, FileUploadProps, UploadFile
and readUploadBytes. Registry helpers: colorPickerEntries and fileUploadEntries.
Schemas: colorPickerSchema, colorPickerNodeSchema, colorValueSchema, fileUploadSchema,
fileUploadNodeSchema and fileUploadValueSchema. BoundColorPicker and BoundFileUpload
lease their mode/cardinality/type constraints and preserve reader/writer permissions.

The exclusive aggregate window added names, catalog types, public barrels, helpers,
fixtures, leaf nodes, binding contracts and AdditionalNodeView routing. Main node-view
remained below 300 lines. Both compiled examples are mounted under Fields. The dedicated
CSS files use existing template tokens plus colorPickerVariables. MkDocs lists only
public component documentation; this verification record remains outside docs.

## Verification

- `.cache/form2-coverage-final.log`: 48 tests in 19 files pass. All 28 owned executable
  files have 100% statements, branches, functions and lines. Totals: 394 statements, 290
  branches, 99 functions and 344 lines.
- Thresholds and coverage include/exclude settings are unchanged. The scoped coverage
  command reports unexercised unrelated source; only the owned files are asserted here.
- `.cache/form2-lint-final.log`: explicit owned paths pass type-aware lint with no
  warnings.
- `.cache/form2-docs.log`: strict MkDocs build passes to a local cache directory.
- Component SSR tests hydrate LTR/RTL controls without recoverable errors, ambient
  randomness, viewport dependence or cross-request state leakage.
- `.cache/form2-transport.log`: both generative routes, actual Jotai writes,
  incompatible kinds/values and unchanged initial document budget pass.
- `.cache/form2-types-final.log`: all four strict projects pass, including runtime,
  declarations, consumer type checks and compiled TSX examples.
- `.cache/form2-schema-check.log`: expected stale generated generative schema. The
  coordinator regenerates shared artifacts at the complete integration boundary.

## Production and bundle evidence

- `.cache/forms-final-build.log`: the final official build passes unchanged acceptance
  gates. Largest chunk 340,353 bytes; total JavaScript 1,396,106 bytes; initial static
  graph 1,250,738 bytes; thirteen chunks. These are raw artifact sizes, not timing
  claims.
- `.cache/forms-final-browser.log`: all fifty-four Chromium scenarios pass. This
  includes all twenty Form2 cases, the thirty parallel Checkbox/Select/Slider cases and
  all four existing module-loading/failed-load/state-preservation gates.
- Form2 conformance covers both templates, 240/360/768/1440, 200% text, actual RTL,
  color-area pointer and channel keys, native values/required/protection, canonical
  actual file bytes, controlled rejection and readable long filenames.
- `.cache/form2-files-360.png`, `.cache/form2-files-1440.png`,
  `.cache/form2-color-360.png` and `.cache/form2-color-1440.png` were visually
  inspected. Removal actions now yield a row at narrow widths rather than squeezing the
  filename.
- `.cache/form2-adapter-conformance.log`: all ninety-five then-registered adapter
  examples pass. `.cache/form2-owned-policy.log` has no owned policy violations.

The initial official build in `.cache/form2-build.log` genuinely failed its existing
500,000-byte main-chunk cap at 572,830 bytes. A parent-approved named React Aria vendor
family group fixes this without increasing budgets, warnings or loading thresholds. The
exact two-file Vite/spec correction is frozen separately from the new Form2 files.

## Regression details

`.cache/file-metadata-newline-before.log` and the second pre-fix run each contain one
failing mixed metadata loop. The actual behavior fixed is filename Unicode U+2028/U+2029
(and C1 controls) accepted by the previous negated character class. MIME and state-key
line-break tests already passed before the change. The initial report of two failures
and a shared state-key or permissive-dollar bug was incorrect. The standalone Node
comparison is `.cache/file-metadata-regression-audit.json`. Retained MIME/key cases are
regressions for existing guarantees. Base64 scans exact lengths and every ASCII digit;
it does not use regex anchors or decode to validate canonical data.

`.cache/color-form-debug.log` captures a real native form rejection: the SDK's hidden
brightness range had fractional value 66.67 with step 1. The adapter now uses the SDK's
public form association prop to detach private channel inputs deterministically. The
canonical bridge and hex draft remain in the host form and still validate normally.
`.cache/color-native-form-after.log` confirms eight relevant tests pass after
correction.

Native Chromium also caught blur feedback shifting Submit between pointer down/up.
`.cache/form2-browser.log` records the first twenty-two passes/two failures;
`.cache/form2-color-debug.json` confirms no click/invalid event occurred. Persistent
neutral guidance now changes error semantics without changing geometry.

`.cache/form2-color-contrast-before.log` records two real invisible-feedback failures
under valid danger/onDanger tokens. Feedback now inherits validated text contrast and
uses layout-neutral underlining. `.cache/form2-file-readable-before.log` captures the
107-pixel filename column in a 302-pixel row; the existing stack-track flex basis fixes
it. The final shared fifty-four-case run includes both corrected assertions.

`.cache/file-cancel-focus-before.log` captures focus falling to body on cancellation;
`.cache/file-cancel-focus-after.log` verifies focus returns to the visible chooser.
`.cache/file-stale-feedback-before.log` and `-after.log` capture/verify obsolete intake
feedback clearing when host settings change. A transient worker-start resource timeout
ran no tests and is not treated as a behavioral red or verification evidence.

## Boundaries

This is a curated adaptation. FileUpload omits folders, image previews, arbitrary MIME
expressions and network progress. ColorPicker omits arbitrary CSS colors, layouts and
SDK props. No full Nuxt parity or schema-only proof of browser rendering is claimed.

Primary sources are official Nuxt ColorPicker/FileUpload sources and React Aria docs:

- https://github.com/nuxt/ui/blob/v4/src/runtime/components/ColorPicker.vue
- https://github.com/nuxt/ui/blob/v4/src/runtime/components/FileUpload.vue
- https://react-aria.adobe.com/ColorPicker
- https://react-aria.adobe.com/ColorArea
- https://react-aria.adobe.com/ColorSlider
- https://www.rfc-editor.org/rfc/rfc4648#section-3.5

Raw Nuxt references are retained under `.cache/references/`. Browser drafts are
`demo/e2e/color-picker.spec.ts` and `demo/e2e/file-upload.spec.ts`: twenty production
scenarios across two templates, narrow/wide/200%/RTL, pointer/keyboard and native forms.

## Frozen handoff

`.cache/batches/form2/manifest.json` lists the new owned paths. Shared registration
proposals are recorded separately in that manifest; merge additions rather than
replacing active root aggregates. The coordinator owns the fileList shared-kind delta.
`.cache/batches/form2-bundle-grouping/manifest.json` contains only the two existing Vite
configuration/build-spec modifications. Logs, screenshots, manifests and generated
coverage retain tool-required formats and are excluded from maintained-source limits. No
runtime production files were excluded from coverage. All work remains local.
