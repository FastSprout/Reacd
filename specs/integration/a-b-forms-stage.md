# Forms and chat integration candidate

The source baseline is the immutable b02-b03-stage checkpoint in fork-a. Merge
only the explicit owned additions and reviewed aggregate changes. Preserve the
later temporal recovery, Data and ColorLocale corrections already in fork-a.

Requirements are the delivered Switch, Textarea, FormField, Input, Form and
Chat Composer specifications, plus InputMenu. Tests preceded their isolated
implementations. This stage composes their existing acceptance tests rather
than redefining their contracts. No inventory acceptance is claimed here.

Reviewed integration preserves A's one FormScopeContext, trusted DOM-aware
form boundary, centralized nested-form diagnostic and submit propagation guard.
The duplicate B form-scope.tsx dependency is intentionally not imported. Input
read bindings now have a read-only projection; the public type assertion was
extended to cover both supported access modes. Existing readWrite stays valid.

FormNodeView groups Form, FormField, SubmitButton, Switch, Textarea and InputMenu
routes to keep the central dispatcher within the maintained source limit.
Every adapter remains present in the exhaustive typed catalog and fixture.
No additional application styling or native events are exposed.

Before InputMenu import: all four strict TypeScript projects passed, source
policy passed, and 169 focused tests across 40 files passed in 26.37 seconds.
Original integration failures are retained in .cache/forms-types.log and
.cache/forms-policy.log; corrected logs have the -after suffix. The copied
checkpoint originally omitted maintained tooling/build; four files were
restored from hash-verified immutable A acceptance evidence.

InputMenu payload hashes match its immutable candidate. Its own 28 tests,
14 runtime files at all-four 100% coverage and nine production Chromium cases
are isolated proof. Its packed-consumer rerun and the combined gates remain
pending. A requested two review overlays before final acceptance: focus return
after clearing text and rejection of CR/LF canonical single-line values.

This is a source checkpoint for deliberate integration, not final verified
behavior. Regenerate JSON schemas after all aggregate changes. Full coverage,
package, browser and strict documentation gates remain combined responsibilities.
