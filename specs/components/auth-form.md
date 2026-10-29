# AuthForm

Status: implemented in the isolated Agent A batch; verification recorded separately.

AUTH-001: AuthForm is a closed authentication-form composition shell. Required label,
submitLabel and onSubmit identify the form/action. Optional title/description,
leading/header/children/footer, error, separatorLabel and provider actions compose the
interface. Credential fields are ordinary controlled reacd children, not native inputs
or a second implicit form-state system. The existing Form/Input contracts remain owned
by B and are consumed without modification.

AUTH-002: Providers are optional uniquely keyed label/onPress records with closed intent
and disabled options. No vendor ButtonProps, native events, raw icons, URLs, HTML or CSS
bags are accepted. Native type-button controls never submit the credential form. Header
and leading slots can contain safe branding components supplied by the host.

AUTH-003: The host owns business validation and authentication. Form submission uses the
existing Form behavior and native required/email validation from its controlled
children. No credential collection from DOM, network request, OAuth implementation,
schema callback constructor or implicit persistence is introduced. SubmitLabel remains
explicit; the engine owns the single submit control and its blocked state.

AUTH-004: Disabled and loading default false. Both disable fields/provider actions and
submit, and prevent a programmatically submitted form from invoking the host callback.
Loading adds a live status with an explicit optional loadingLabel or named default. The
status has no busy ancestor, including while its credential fieldset is busy. Error is
bounded nonempty plain text announced as an alert. Native validation remains distinct
from server/global error display. No fixed card height hides long text.

AUTH-005: Source authoring is TSX with controlled Jotai values. Generative transport
uses required child arrays and optional arrays for every content slot. onSubmit becomes
submitAction; provider callbacks become registered action names. Loading and disabled
may read explicit boolean state references. Fields retain their independently defined
read/readWrite bindings and business values. Every provider, submit and descendant
action/reference is checked before the form is exposed.

AUTH-006: The root uses engine-owned heading scope. Its own title and form label remain
separate. Providers, fields and the submit control are keyboard reachable in declaration
order. Busy/disabled forms expose native disabled semantics; closed safe slots do not
permit nested native forms or styling overrides in application source.

AUTH-007: Private FormSurface rejects physically nested forms. A shared trusted boundary
combines the logical scope with actual native ancestry. Direct nesting is rejected
before invalid native markup is committed, including SSR and hydration. A physically
separate portal form is permitted after its boundary is inspected. Nested forms inside
that portal remain invalid. Native submit propagation stops at the submitting form, so a
portal submission never invokes a logical ancestor's callback. Public Form/Input
contracts stay unchanged; callbacks receive exactly their declared logical arguments.

## Acceptance

- Closed schema/consumer tests reject duplicate provider identities, native content,
  arbitrary submit button bags, invalid callbacks and executable JSON.
- DOM/SSR/hydration tests exercise native required fields, independent providers, global
  errors, busy/disabled guards and isolated Jotai values.
- Transport tests validate every content slot, own registered actions, missing/read-only
  or mismatched state definitions and loading/disabled reads.
- Both templates at 240/320/768/1440, scoped LTR/RTL and 200% text verify actual native
  validation/focus, independent local callbacks, state retention and containment. Native
  geometry checks exempt only Base UI's fully clipped, fixed-origin, unnamed one-pixel
  input mirror with aria-hidden=true and tabIndex=-1. Unclipped hidden inputs and
  visible escaped controls remain detectable; viewport scroll bounds stay checked.
- Every production file retains 100% statement/branch/function/line coverage.

## Primary reference and React adaptation

https://ui.nuxt.com/docs/components/auth-form, cached 2026-10-29.

Controlled TSX children replace upstream auto-generated field configurations; safe
provider records replace arbitrary vendor props. Explicit host callbacks and state
replace Nuxt-specific schema/validation/automatic loading integration. All examples are
local demonstrations and do not authenticate users or send credentials.
