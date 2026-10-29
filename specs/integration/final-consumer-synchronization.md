# Remaining single Select consumers

A complete immutable run of 2,783 tests produced one failure: Empty's immediate query
could not find Large after reopening its asynchronous Select. All other runtime files
reached 100% in all four metrics; Empty stopped before exercising recovery callbacks.
Evidence: .cache/combined-final-coverage.log. No threshold was changed.

A scoped replay of twelve remaining synchronous consumers, without source changes, then
reproduced seven timing failures: Breadcrumb, CommandPalette, ContentSearch, Dashboard,
Empty, Header and Toast. Five other paths passed but use the same immediate
single-Select discovery pattern. These are test reliability repairs, not new framework
runtime defects. Evidence: .cache/final-consumer-replay.log.

Acceptance: await the actual named list/options and public collapsed state before the
next action. Preserve all selection, veto, state, value and callback assertions. Keep
Select's keyboard-open path and Modal's portalled-list-inside-dialog assertion. Leave
CommandPalette/ContentSearch/Dashboard command-list choices, InputMenu and multi-select
flows unchanged. Do not add sleeps, mocks, larger timeouts or runtime changes.

Final scoped replay: all seventeen tests across twelve files pass. Empty's production
example reaches 100% statements, branches, functions and lines (25/22/3/25). Two palette
and locale wrappers still use Radix rather than the named-list Base UI Select, so their
existing pointer/regex choices await actual options and collapsed triggers directly.
The first shared-helper attempt exposed this test-only discovery distinction; no
production label, SDK, callback, state or event behavior was altered.
