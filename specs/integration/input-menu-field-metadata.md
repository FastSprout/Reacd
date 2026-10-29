# InputMenu field metadata and canonical feedback correction

Status: isolated acceptance passed; combined project acceptance pending.
Requirements: INPUT-MENU-005 and INPUT-MENU-009.

The original component-owned delivery has two integration defects. After required
validation, a read-only host update leaves stale required feedback. A disabled
FormField does not protect an already-open suggestion portal when its child explicitly
declares disabled=false. Both defects have failing acceptance logs before correction.

The adapter consumes the existing trusted metadata before its model and native bridge.
Explicit name/required override defaults; disabled scopes combine with OR. Outer help
and error associations merge with local guidance, without duplicate diagnostics.
Required feedback derives from current canonical text/flags after a validation attempt;
callback failures remain a separate diagnostic. No public API or state kind changes.

## Verification

- Initial two regression cases failed on the exact original owned runtime.
- Six new integration cases pass, including overrides and scoped feedback.
- Final owned scope:40 tests/13 files;15 executable files at100% statements,
  branches, functions and lines (181/133/52/162);3 empty type/barrel files.
- Official production build and unchanged bundle budgets pass.
- All four strict TypeScript projects, explicit typed lint and source policy pass.
- Schema/example freshness, packed consumer and strict MkDocs pass.
- Eleven existing production Chromium journeys passed. Four new cases passed on
  both templates:read-only required host recovery and disabled open-portal protection.
- The first new browser harness used global alerts across unrelated catalog examples
  and a role lookup hidden by the open SDK portal. Corrected queries scope alerts to
  the owning form and retain the host-control handle before opening. No runtime change
  was made in response; initial failure logs are retained.
- The staging base had a stale generated transport schema. Local regeneration restored
  freshness; generated schemas are excluded from this narrow overlay. The integrator
  must regenerate them after composing all shared registrations.

Apply this overlay after `.cache/batches/input-menu-owned-final/manifest.json`.
Its manifest records exact baseline and payload hashes for every modified path.
New test and ledger paths have no baseline. The shared FieldMetadata dependency is
hash-verified, not copied or modified. Complete combined checks and inventory status
remain the integration owner's responsibility. Original root source is untouched.
