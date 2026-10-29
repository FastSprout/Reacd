# Legacy Select consumer acceptance synchronization

Status: original failing proof captured before test adaptation.
Requirements: SELECT-007, DOCS-014 and existing Accordion retained-portal behavior.

The B-compatible Select extension uses the installed Base UI SDK. Its accessible
portal opens asynchronously. Existing Avatar/Tooltip examples synchronously query each
next option immediately after clicking the trigger; both fail before completing their
unchanged journeys. B's full run also captured the same synchronous listbox-query
failure in Accordion. This is test synchronization, not a requested runtime behavior
change. Preserve every original interaction and outcome assertion; await the actual
accessible option/listbox instead of sleeping or increasing timeouts. Explicitly
assert each selected example label and the second Accordion portal before closure.

No runtime source, public API, installed dependency or test threshold changes.

## Scoped evidence

The isolated baseline run failed both example journeys; Accordion passed in that run
but failed at its synchronous listbox query in B's preserved full-run evidence.
After waiting for actual portal semantics,6tests/3files pass. Both examples and the
Accordion adapter retain100% statements,branches,functions andlines:41/35/7/41.
Explicit typedlint and source policy pass. No runtime source changed. The receiving
integrator must include these tests in its complete strict/compiler/browser gates.
