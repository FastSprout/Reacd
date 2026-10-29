# Maintained production browser fixtures

BROWSER-FIXTURE-001: Every conformance route used by the full browser suite must
exist in the ordinary production demo build. A private Vite build/configuration
is not a substitute for that route. Keep the main catalog entry and the existing
bundle warning, graph and asset limits. Do not skip cases or raise timeouts.

BROWSER-FIXTURE-002: /temporal-recovery.html bootstraps the original trusted
native Date/Time recovery harness at test-support/temporal-recovery-browser.tsx.
Preserve its four
labelled reset/recovery regions, native forms, unrelated field reset, controlled
veto/protection, external replacement and same-value unfinished draft behavior.
All twelve existing temporal-recovery scenarios remain unchanged.

BROWSER-FIXTURE-003: Native HTML, React state and DOM bootstrap in this harness
are conformance scaffolding, not application authoring capabilities. Keep native
fixture implementation under existing test-support classification. Add no new
coverage exclusion or production-library runtime hiding. Public app/TSX policy
continues to reject HTML, CSS and native escapes.

BROWSER-FIXTURE-004: First prove the missing region against an ordinary production
build. Then verify route/manifest emission, the dedicated entry smoke and all
twelve existing native browser cases against the standard production output.
Compile the fixture with strict TS7, explicitly lint it and check maintained
source line/column/indentation rules. Record exact build and browser evidence.

BROWSER-FIXTURE-005: The ordinary production build also serves
/listbox-field-metadata.html for the two existing private metadata conformance
cases. Recover their exact prior trusted native harness under test-support/browser;
retain every logical callback, group-error, required/readonly, disabled/focus and
native serialization assertion. Only their destination URL changes. Neither the
public catalog's index nor another private build substitutes for this fixture.
Keep both existing HTML inputs, fixed budgets and all coverage/policy boundaries.

BROWSER-FIXTURE-006: /editor-field-metadata.html is ordinary production conformance
scaffolding using public Editor/FormField/AuthForm TSX and isolated Jotai state.
Deliver its view, DOM bootstrap, HTML and additive fourth MPA input together.
Preserve the other three entries and every fixed asset/lazy graph limit. This
adds no public library capability, application HTML escape or coverage exclusion.
