# InputMenu focus and single-line contract overlay

Status: narrow correction over immutable input-menu-candidate, 2026-10-29.
Candidate sources remain unchanged. Combined types, coverage, package, docs
and browser acceptance remain parent-owned under the global resource lock.

## Corrected behavior

Accepted clear returns focus to the visible input before the conditional clear
button disappears. An explicit callback veto retains that control and value.
The regression failed with body focus before the correction; both focus cases
pass afterward in the dedicated two-test file.

Native single-line inputs remove CR/LF, so accepting them in logical state
would diverge from displayed text. A named FORM_MENU_POLICY pattern and shared
menuTextSchema now reject CR/LF without trimming numeric, empty or space text.
InputMenu value and suggestion labels use that contract. The JSON declaration
and central BindingContract enforce the same schema on initial and active host
state; bound callbacks and atomic transactions cannot bypass it.

The three text-contract regressions failed before the change and pass after:
public TSX/option labels, JSON initial state, and host/atomic writes. A separate
request guard test rejects malformed vendor text before invoking the host.
Only tiny single-file checks were run while parent compilation owned resources;
no broad suites, build, browser, timeout or threshold changes were introduced.

## Integration instructions

Apply after input-menu-candidate and its canonical selection dependency.
The overlay manifest contains exact baseline and payload hashes. Source changes
include the private clear handler, new schema/form-menu-shared/text.schema.ts,
InputMenu schema and node labels, bounded state hook, and the central catalog
binding's InputMenu case. Preserve every other case during that shared merge.
The central binding must import/use menuTextSchema rather than generic text.
Do not globally restrict text state: multiline TextArea/Text consumers remain
valid; this is a mounted single-line control constraint.

Regenerate the combined transport schema. Its generic text-state shape cannot
prove component-specific initial value semantics; validateGenerativeDocument
remains the runtime semantic gate. This overlay makes no standalone portable
JSON Schema or browser-conformance claim for the new predicate.

Run the parent combined gates before marking the candidate plus overlay
accepted. Local evidence retains initial failing and subsequent passing tiny
checks. No live B/fork A/root source or remote state was changed.
