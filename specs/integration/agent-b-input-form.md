# Agent B Input and Form enterprise extension

Date: 2026-10-29. Snapshot: .cache/workspaces/fork-b. This batch extends two existing
compatible catalog entries. It depends on the frozen form-controls field metadata and
b_chat's stable TrustedFormBoundary/FormScopeContext/private stylesheet. Those
dependency files are not copied into this delivery. Requirements: INPUT-001..006,
FORM-001..007.

## Public contracts

Input preserves label/value/onValueChange and the closed inputType set. Optional
name/description/readOnly/loading/minLength/maxLength/autoComplete add semantic form
behavior. Explicit names/required flags override FormField defaults; inherited disabled
always wins. Readonly retains canonical data and required/minimum/email validation.
Loading protects writes while retaining data. Callback arguments remain one string.

Core/input-policy.ts owns limits/defaults and normalization patterns. Single-line
controlled values reject CR/LF; email values reject edge ASCII whitespace before native
rendering could strip them. Ordinary incomplete email syntax remains editable. The HTML5
email pattern constrains submission, not draft state. Password feedback never echoes
values. InputValueSchema(maxLength, inputType) constrains maximum/normalization on
shared host writes. Minimum length/full email syntax remain submission rules.

Form preserves label/children/onSubmit():void. Optional disabled/submitting/errors are
host-controlled. FormSummaryIssue names the strict readonly {label?,message} DTO; up to
twenty summary items are allowed, with trimmed nonempty label-budget text. Summary
errors are informational and do not prevent valid retries. Native validity and explicit
FormField errors block invalid fields; no second error store or path matcher is added.

Submitting marks content inert/busy and preserves enabled canonical FormData. Disabled
uses native fieldset semantics plus inert content to omit values and prevent edits.
Status/summary remain readable. The host owns async requests and business state.

FormSurface uses TrustedFormBoundary to reject nested native markup while allowing a
physically independent portal form. It also stops submit propagation: otherwise React
bubbles an independent portal's submission into its semantic ancestor form, invoking
two public callbacks. Red regression .cache/form-portal-before.log observed inner1/
outer1; corrected .cache/form-portal-after.log asserts inner[[]]/outer0. This matches
A's minimal boundary/stopPropagation patch; merge this existing FormSurface deliberately
instead of overwriting an independently reconciled root copy.

## Parent aggregate integrations

Already merged in the B snapshot; propose equivalent reviewed root changes only.

- Input leaf imports own schema/input/generative.schema.ts inputNodeSchema rather than
  rebuilding its shape centrally. Input.value supports read/readWrite text; mode comes
  from the reference, with inputValueSchema(node.maxLength,node.inputType) constraints.
- FormNode<GenerativeNode> appears directly in the recursive union. Factory:
  createFormNodeSchema(child) from schema/form/index.ts. Flag bindings delegate to
  formNodeBindings; disabled/submitting allow literal or readonly boolean references.
- Form.submitAction reuses registered host action capabilities. Add it to action
  references. BoundForm receives node without raw children, registry, actions and
  rendered safe children. Missing/prototype-inherited actions cannot execute.
- SubmitButton becomes a literal leaf via its own submitButtonNodeSchema. Its public
  props and renderer are unchanged. Dispatch to existing SubmitButton; no executable
  JSON or new state kinds are introduced.
- Export named FormSummaryIssue with Form/FormProps. Input/Form public modules retain
  their existing names/Props. No AuthForm caller needs new required props or arguments.
- Import styles/input.css and styles/form.css, plus b_chat's form-boundary.css. The
  Input auto block size prevents fixed-height vertical text clipping under text200%.
- Mount InputExample/FormExample in Fields and add Form MkDocs navigation/reference.
  Public docs and compiled examples live in matching docs/components and docs/examples.

Checkbox/Slider/Select remain separate work. InputMenu/SelectMenu/Listbox are reserved
for A after its own scope. ColorPicker/FileUpload are delegated to the Data worker. No
production files from those unfinished scopes are included in this manifest.

## Verification

- Focused acceptance: .cache/input-form-coverage.log, 125 tests across twenty files.
  This includes existing Input schema coverage and trusted boundary dependencies; it
  does not claim 125 newly written tests. New requirements were specified and exercised
  red before implementation in input-enterprise-before, input-binding-before,
  input-normalization-before, form-extension-before and form-generative-before logs.
- Coverage: .cache/coverage-input-form/coverage-summary.json. All nineteen executable
  owned/modified source/example files have 100% statements, branches, functions and
  lines: 120 statements, 98 branches, 33 functions and 115 lines. Unchanged global
  coverage includes/thresholds remain enabled; focused execution exits1 for unrelated
  unexercised files. No executable runtime code is excluded. Type-only modules/barrels
  have no executable statements.
- Full four-project types: .cache/input-form-final-types.log, exit0. Explicit no-ignore
  typed lint: .cache/input-form-final-lint.json, 34 files and zero diagnostics. Owned
  maintained files pass the 300-line/88-column/two-space/English source requirements.
- Official production build: .cache/input-form-chat-final-build.log, exit0. Shared
  Chromium run: .cache/input-form-chat-final-browser.log, all24 pass: own Input/Form12
  plus b_chat's twelve composer scenarios against the same stable output, no rebuild.
  Own matrix covers both templates240/360/768/1440, text200%, scoped RTL, vertical text
  fit, readonly email/required focus, exact FormData, busy/inert duplicate guards,
  disabled omission and stale-summary retry. The real portal regression is a DOM unit
  test; no additional portal-browser claim is made.
- Inspected screenshots: .cache/input-form-spacious.png and input-form-compact.png.
  Narrow compact/RTL/text200% preserves labels, summary wrapping and native input text.
  Initial shared Chat failures were owner-fixed assertion/layout issues; final all24
  success is the acceptance evidence, not the earlier mixed-run exit status.

All work remains local. Cache/build/generated artifacts retain tool formats and are not
maintained source or delivery paths. Root packaging, schema freshness, strict MkDocs and
combined acceptance remain parent-owned. This batch does not complete the full
enterprise catalog or eliminate browser conformance testing.
