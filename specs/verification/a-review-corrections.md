# Original Agent A review corrections

Status: scoped correction gates passed; complete integrated acceptance is pending.

## Review provenance

Independent Standards and Spec reports compare original A acceptance with
`review-root-baseline`. Three distinct confirmed findings concern RENDER-015 native
arguments, RENDER-014/AUTH-004 loading announcements and COMMAND-003 search admission.
This copy starts from `pre-review-fix-source`; all 2,964 source hashes were verified. No
original root or `fork-a` source is edited.

## Requirements and red-first corrections

- Navigation top-level and submenu actions now use the existing `pressHandler` boundary.
  Separate native pointer tests captured both callbacks receiving SyntheticBaseEvent;
  accepted callbacks now receive exactly zero arguments.
- AuthForm status now sits outside its busy credential fieldset. The regression captured
  its original busy ancestor and preserves the fieldset's busy/disabled state.
- Command matching now sorts all eligible candidates before the global result cap.
  Earlier description-only groups cannot exclude later exact/prefix label matches.
  Visible groups retain declaration order, admitted items retain rank order and ties
  retain declaration order. External results preserve host order. The public reference
  explicitly describes this grouped admission contract.
- Followup confirmed the review's AuthForm portal question: already-open Select options
  still invoked onValueChange('admin') after either loading or disabled became true.
  Existing FieldMetadata context now carries the effective disabled scope across the
  portal. Nested names, required overrides, error/descriptions and reenable behavior are
  tested. No public API or Form renderer change was required.

Requirements were clarified before their acceptance tests and runtime changes. Primary
red logs are `a-review-red.log`, `a-menu-boundary-red.log` and `a-auth-portal-red.log`.
The initial click-only portal probe did not execute the SDK's pointer selection path;
its passing result is retained as an incomplete probe, not evidence against the defect.

## SDK mirror and containment conformance

The expanded AuthForm example exposed a separate private SDK composition issue. Base UI
Select's unnamed native mirror is fixed at viewport origin, aria-hidden, tabIndex=-1 and
fully clipped with inset(50%). A positioned parent cannot anchor this fixed mirror. The
engine's universal interaction minimum changed its SDK height from 1px to 44px.

SELECT-005 now preserves this SDK dimension. A narrow selector resets min-block-size
only for direct Select-entry hidden SDK inputs. A real browser red verified its exact
placement, width=1px, height=44px and the visible trigger's named minimum. The final
browser checks verify height=1px and preserve the visible control's minimum target.

The old Auth geometry assertion also counted this fully unpainted origin mirror as
escaped visual content. Its local helper exempts only native inputs matching every SDK
invariant: aria-hidden=true, tabIndex=-1, fixed position, computed 1px width/height and
computed inset(50%) clipping. All other content checks, the one-pixel tolerance and
viewport scroll bound are unchanged. A negative browser probe still detects an actual
one-pixel aria-hidden input without clipping and a visible escaped control. The global
negative overflow test remains unchanged. No visible text overflow was established by
the SDK mirror diagnostic, and no broad hidden-node exclusion was introduced.

## Verified scope

- 19 tests across seven files pass. All four changed executable files have 100%
  statements, branches, functions and lines: 52/50/20/49 measured paths respectively.
- Official build and unchanged bundle budgets pass, as do all four strict TypeScript
  projects, affected typed lint, complete source policy, schema/example freshness,
  packed consumer/SSR/export checks and strict MkDocs.
- Nine fresh production Chromium cases pass with one worker and zero retries: both
  templates at 240px, scoped RTL and 200% text for Auth, navigation and search; open
  portal loading/disabled protection and recovery; SDK mirror dimensions/visible target;
  and the explicit hidden-unclipped/visible-control negative containment probe.
- Existing Auth/media assertions also retain native required/email validation, submit,
  provider independence, focus order, state retention and template changes.

The first green unit run found a test query ambiguous between two legitimate fieldsets;
that assertion now identifies the provider's nearest credential fieldset. One existing
Escape assertion initially raced popup removal and now waits for actual removal without
sleeping or increasing timeouts. A test-only invalid Testing Library `exact` option was
removed after strict type checking rejected it. The expanded Text example was corrected
from mixed children to one typed string. All intermediate logs remain retained.

An initial browser grep selected only the two new portal cases; final verification
selected all nine intended cases. Failed mirror/conformance logs and browser artifacts
are retained separately from final green evidence. These scoped checks do not replace
full combined acceptance or establish assistive-technology announcement behavior.
