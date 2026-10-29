---
template: preview.html
reacd_preview: Form
reacd_preview_height: 560
---

# Form

Submit a closed TSX form through a zero-argument logical callback. Native controls and
controlled FormField errors own validation; the host owns asynchronous business state.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/form.tsx"
```

```tsx
<Form label="Project form" onSubmit={saveProject} submitting={saving} errors={summary}>
  <Input label="Project name" value={name} onValueChange={setName} required />
  <SubmitButton label="Save project" />
</Form>
```

Native required, length and email rules run before submission. FormField can supply
controlled field-specific business errors. The callback receives no browser event or
FormData; application state stays in your isolated Jotai store.

`errors` is a readonly array of up to 20 `{ label?, message }` summary items. Text is
trimmed, nonempty and bounded by the label budget. The labelled alert is informational:
a stale server or network summary remains visible while a valid form can retry.
Associate business field errors explicitly through FormField rather than expecting
summary labels to locate controls. No implicit error store or matching rules are added.

`submitting` marks the form busy and makes its content inert, preventing duplicate
submission and editing. Enabled canonical fields remain in native FormData. `disabled`
uses a native disabled fieldset and inert content, excluding values and validation.
Status/summary stay readable. The host can update state and end either protected mode.

Nested forms are rejected by the trusted renderer. A portal outside a native form can
host an independent form; a portal inside an existing form cannot bypass the guard.
Applications do not receive native rendering or DOM escape hatches.

| Prop       | Contract                                             |
| ---------- | ---------------------------------------------------- |
| label      | Required accessible form name                        |
| children   | Safe reacd content                                   |
| onSubmit   | Required logical callback with zero arguments        |
| submitting | Controlled busy/inert state; retain canonical values |
| disabled   | Controlled disabled/inert state; omit values         |
| errors     | Optional bounded readonly FormSummaryIssue array     |

The exported `FormSummaryIssue` type names the summary DTO. Styling and native events
are not public props. Existing callers require no changes.

Optional generative transport uses a registered `submitAction` capability and recursive
children, including the literal SubmitButton leaf. Disabled/submitting may be literal
booleans or read-only boolean-state references. Summaries are bounded literal DTOs. Host
actions receive the existing logical registry context, never a browser event. Unknown
actions and incompatible flag bindings are rejected before interaction.

The compiled [Form example](../examples/form.tsx) demonstrates retryable summaries,
submission counts, protection and scoped RTL without claiming a real backend request.

Disabled or submitting forms also suspend user interaction in open child portals.
Submitting retains enabled canonical FormData; disabled omits it. Client mounting
rejects actual native form ancestry before creating nested markup. SSR uses logical
form scope, so trusted server markup must avoid raw native form ancestors that the
server cannot inspect through browser DOM.
