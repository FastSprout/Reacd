# Agent B: expanded Fields browser fixtures

Status: ready test-only overlay with explicit pending final combined browser proof.
Form controls and InputTags pass all twenty focused scenarios. Workbench received
additional geometry corrections after its two intermediate failures; their final
acceptance runs in the coordinator's fresh main matrix.

## Scope and requirements

Implements FIELD-FIXTURE-001 through FIELD-FIXTURE-005. Three existing browser files
are changed; application rendering, styles, component contracts and dependencies are
untouched. Earlier immutable component batches are not rewritten.

The original Form controls RTL assertion selected the first fieldset in the complete
Fields catalog. New Checkbox examples placed Account approval before the separately
scoped Account fields form. The test now targets that named form's Approval group.
Widths, both templates, 200% text, page overflow, all existing child bounds and touch
targets remain checked.

The original InputTags global alert assertion matched its duplicate-tag error and an
unrelated Form errors summary. Its input, chips, removals, RTL root and error now belong
to the named Topics form. The exact unique-tag message, retained draft, real clipboard
paste, keyboard deletion, focus and read-only behavior remain unchanged. Other alerts
are neither suppressed nor selected by position.

Workbench addresses stable Slider name Volume and retains aria-valuenow 60. Its restored
Ready table is the named Example inventory, alongside other newly mounted tables and
Chart alternatives. Both complete journeys retain every form, persistence, action,
state transition and generative interaction.

## Geometry compatibility

TrustedFormBoundary uses display:contents. Its zero rectangle does not represent a
layout box, so comparing a child form against that direct parent was invalid. The test
now climbs transparent ancestors and preserves child bounds against the real owning
box. It does not skip the child or loosen the pixel tolerance.

The legacy role-attribute query did not include Base UI's implicit-role range input.
The geometry query now includes native inputs inside reacd-range-root. It measures the
visible thumb and control, retains four-edge bounds and proportional value alignment,
and handles vertical and actual RTL direction. Native min/max attributes supply
implicit ARIA bounds; explicit aria-valuemin/max remain supported. Invalid finite spans
still fail. Unrelated private color channels are outside the Slider formula.

## Evidence and pending checks

- `.cache/b-browser-all-results/` contains eight original RTL failures selecting the
  unrelated Checkbox fieldset and two global-alert ambiguity failures.
- `.cache/fields-browser-scope.log`: twenty Form/InputTags scenarios pass. The two
  Workbench journeys reach final containment and expose direct non-box parent checks.
- `.cache/fields-browser-workbench-after.log`: after the parent-box correction, the
  newly exercised implicit Slider check exposes the old ARIA-only bounds assumption.
  Reading native min/max is the subsequent test-only correction.
- `.cache/fields-browser-scope-lint.log`: all three browser files pass explicit
  type-aware lint without warnings.
- `.cache/fields-browser-scope-policy.log`: no maintained-source violations.

The last two Workbench corrections are not described as passing scoped browser proof.
The coordinator's official fresh build and main matrix include every changed test;
their final acceptance is pending when this overlay is frozen. No duplicate preview
run or output rebuild is required to prepare the handoff.

## Local delivery

The manifest records baseline and final hashes for all three existing test files,
plus the new acceptance addendum and this ledger. Merge deliberately when a baseline
differs. No native component fix, threshold change, timeout increase, source test hook
or hidden-role workaround belongs to this overlay.

Tool logs, original browser error contexts, screenshots, traces, temporary preview
configuration and manifests retain required formats outside maintained-source limits.
No production source is excluded from coverage. Final full-site browser acceptance
remains coordinator-owned. All work stays local without commits or publication.
