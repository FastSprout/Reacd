# Agent B Switch, Textarea and FormField delivery

Date: 2026-10-29. Snapshot: .cache/workspaces/fork-b. This batch delivers three named
Form catalog entries. Frozen Date/InputTime batches and their follow-ups are unchanged.
Requirements: SWITCH-001..006, TEXTAREA-001..007 and FORM-FIELD-001..008 in matching
specs/components files. This is not completion of the remaining Form/enterprise scope.

## Component-owned contract

- Switch/SwitchProps: components/switch/index.ts; switchSchema/switchNodeSchema:
  schema/switch/index.ts; ShadcnSwitch: adapter/shadcn/switch/switch.adapter.tsx.
- Textarea/TextareaProps: components/textarea/index.ts; textareaSchema,
  textareaValueSchema(maxLength) and textareaNodeSchema: schema/textarea/index.ts;
  ShadcnTextarea: adapter/shadcn/textarea/textarea.adapter.tsx.
- FormField/FormFieldProps: components/form-field/index.ts; formFieldSchema,
  formFieldPropertiesSchema, fieldErrorSchema, createFormFieldNodeSchema(child) and
  FormFieldNode<Child>: schema/form-field/index.ts; ShadcnFormField:
  adapter/shadcn/form-field/form-field.adapter.tsx.

Switch is a complete controlled boolean form control with readonly/loading protection,
required validation and canonical serialization. Textarea adds bounded automatic rows,
minimum submission/maximum state limits and readonly semantic validation. Existing
Toggle and TextArea APIs remain compatible; these are dedicated modules, not aliases.

FormField provides a semantic fieldset and optional group caption. Child labels remain
native and unchanged. Explicit name/required overrides metadata defaults; disabled
combines with OR. Nested descriptions/errors remain associated without duplicate IDs.
Controlled errors block submission and focus a visible scoped control, or the group if
empty. Hidden native validity projections never expose DOM events publicly.

Native readonly text fields are normally barred from constraint validation. The trusted
projection intentionally remains validateable, preserving required/minimum semantics for
readonly canonical data. Disabled fields omit values and validation. A host must fix
missing readonly business data rather than bypassing required validation.

Textarea measurements observe width and font changes, clean up subscriptions, preserve
focus/selection and clamp rows. Inverse scrollHeight measurement rounds to discrete
lines; integer pixel rounding must not add a spurious row under fractional metrics.
Regression: .cache/form-fractional-before.log (2 rows incorrectly became 3), corrected
in .cache/form-fractional-after.log. All layout values remain in named policies/tokens.

## Parent aggregate integration

The parent registered these changes in the B snapshot. Merge deliberately into root; do
not replace whole aggregate files.

1. Public exports/catalog/registry: three names/Props, corresponding adapters and
   FORM_CONTROL_EXAMPLES from adapter/shadcn/**tests**/form-control-examples.tsx.
2. Generative leaves: switchNodeSchema, textareaNodeSchema. Recursive union includes
   FormFieldNode<GenerativeNode> directly, with createFormFieldNodeSchema recursion.
3. Bindings: Switch.checked boolean; Textarea.value text with textareaValueSchema max;
   FormField.error literal or readonly text-state reference. No new state kinds.
4. Node dispatch: BoundSwitch, BoundTextarea, BoundFormField. Pass rendered recursive
   children to BoundFormField. Error-state changes preserve child identity/value.
5. Import renderer/styles/form-controls.css after baseline controls/toggle styles.
6. Mount SwitchExample, TextareaExample and FormFieldExample from matching docs/examples
   files in the Fields catalog; add three public MkDocs component references.

The new renderer/form-field/field-metadata.ts carries logical metadata only. It adds no
business store. Generative bindings use existing isolated Jotai registries; read mode
forces readonly, not disabled. Only maximum text length constrains editable state.

Existing Form.onSubmit():void is unchanged in this batch. TrustedFormBoundary and the
later controlled Form extension are separate work. Additional in-progress Input and
numberRange files in the live snapshot are not included in this freeze.

## Evidence

- Schema/adapter/state/public/SSR/example tests: .cache/forms-coverage.log, 41 tests in
  17 files. Acceptance was written before runtime implementations. Early failures:
  .cache/form-field-before.log, .cache/switch-before.log, .cache/textarea-before.log,
  .cache/form-bindings-before.log and .cache/form-examples-before.log.
- Coverage: .cache/coverage-form-controls/coverage-summary.json. All 25 executable owned
  source/example files reach 100% statements, branches, functions and lines: 157
  statements, 170 branches, 41 functions and 150 lines. Unchanged global includes and
  thresholds remain enabled; focused execution exits 1 for unrelated unexercised files.
  Type-only modules/barrels have no executable statements. No runtime code is excluded.
- Full four-project types: .cache/forms-final-types.log. Explicit no-ignore typed lint:
  .cache/forms-lint.json; 54 files, zero diagnostics. Maintained owned files satisfy 300
  lines, 88 columns, two-space indentation and English source policy.
- Official production build: .cache/form-controls-build.log, exit 0. Chromium:
  .cache/form-controls-browser.log, all 10 scenarios pass on isolated preview port5198.
  Both templates at 240/360/768/1440px, text200%, scoped RTL, native readonly required
  focus, exact FormData, error focus/clearing, disabled omission and actual row cap/
  grow/shrink pass. No page errors in functional scenarios.
- Inspected screenshots: .cache/form-controls-spacious.png and
  .cache/form-controls-compact.png (narrow scoped RTL). Guidance/error text wraps and
  controls stay contained. No claim is made for untested browser engines or screen
  reader announcement timing.

All changes stay local. Generated coverage/build/cache artifacts retain tool formats;
they are not maintained source or part of the component delivery path list. Package,
schema freshness, MkDocs strict build and full combined gates remain parent-owned.
