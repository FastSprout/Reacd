# Form

Status: enterprise extension preserving existing AuthForm/TSX compatibility.

FORM-001: Preserve label, safe children and onSubmit():void. Add optional controlled
submitting, disabled and errors. Errors are a bounded readonly array of strict
{label?,message} summary DTOs, with nonempty trimmed text. No DOM events, native
FormData, arbitrary render callbacks or second validation/error store enter the API.

FORM-002: Native control validity and controlled FormField errors block invalid
submission. Summary errors are informational and MUST NOT block retry: prior server or
network feedback can remain visible while a valid native form invokes onSubmit again.
The host owns async state, business validation, summary clearing and FormField errors.
Do not infer field mappings or focus links from summary labels.

FORM-003: A controlled submitting form is busy and prevents editing/duplicate submit.
Its canonical enabled field values remain in native FormData. A disabled form prevents
editing/submission and omits descendant values through native fieldset semantics. Use a
trusted inert content boundary for nonnative controls too. Host state writes remain
allowed. Logical availability also masks already-open portals; protected content cannot
publish user edits from outside the physical fieldset. Only disabled scopes omit values:
submitting retains canonical enabled values in native FormData. Native focus and
validity remain owned by participating controls.

FORM-004: Wrap native FormSurface with the trusted renderer TrustedFormBoundary. Reject
nested logical or actual native form ancestors before producing invalid nested markup. A
portal outside a native form can create an independent form. A portal inside a native
form cannot bypass the guard. Reuse the existing form scope; no duplicate provider. Stop
native submission propagation at each trusted form so a physically independent portal
form does not also invoke a React-ancestor form callback. Client mounting probes the
scoped native ancestor before mounting a form; it never emits temporary nested forms.
SSR uses logical scope without querying unavailable host DOM. Host-rendered native
ancestors must therefore be declared safely by trusted server integration.

FORM-005: Announce controlled summary feedback as a labelled alert and associate it with
the native form. Display optional summary labels as plain text, never as fake links.
Announce actual host-controlled submitting status outside the busy native form,
consistent with RENDER-014, while preserving FORM-003 form-level aria-busy. Keep
summary/guidance outside inert form content. Appearance comes from adapter tokens.

FORM-006: Acceptance includes closed schemas/types, unchanged zero-argument callbacks,
native required validation, informational summary retry, busy/disabled duplicate guards,
exact canonical FormData, nested rejection/portal independence, SSR/hydration and
both-template responsive/RTL/browser interaction. Require 100% per-file statements,
branches, functions and lines. No generative action contract is silently invented.

Primary reference checked 2026-10-29:

- https://ui.nuxt.com/docs/components/form

Nuxt validation callbacks, schema-library execution, implicit path matching and nested
form data orchestration are host responsibilities in this closed controlled contract.
FORM-007: Optional generative FormNode<Child> requires a registered host submitAction
key and recursive safe children. Reuse the existing action capability context; never
execute JSON or expose DOM events. disabled/submitting may be literal booleans or
read-only boolean-state references. Summary errors remain bounded literal DTOs.
SubmitButton is a literal leaf using its existing closed TSX contract. Validate action
registration and flag binding kinds/access before exposing an interactive form. Recheck
the own callable capability on every submission. Revocation or replacement after
rendering must never execute a captured stale or inherited handler.
