# Agent B: independent workbench journeys

The final combined unit and browser verification exposed a five-second timeout
in one workbench test that combined searching families, restoring navigation,
lazy field loading and typing/submitting an entire controlled profile. The test
stopped before the profile submit callback and therefore left that function
uncovered. The production browser pipeline separately passed all 529 workbench
and 12 recovery cases on the same source; this was not a profile runtime defect.

Separate family searching from profile submission into two complete integration
journeys. Retain every existing search, empty state, lazy heading, field value,
checkbox and save assertion. The search case now also explicitly verifies that
clearing the filter restores the Fields navigation action. Each journey owns
its own App/provider and user interaction instance.

Keep the existing five-second test timeout, production code and coverage
thresholds unchanged. Full unit/coverage verification remains required after
this test-only correction. Local verification output is recorded separately;
this specification is not a passing gate by itself.
