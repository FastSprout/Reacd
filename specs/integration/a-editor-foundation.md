# Pure Editor foundation and rich-document state

Status: integrated source candidate; complete combined acceptance is pending.
Baseline: the immutable form2-controls-stage source candidate. No native Editor
surface, TipTap dependency, toolbar or menu is imported by this followup.

The immutable B editor-foundation payload was checked against all17 hashes.
The two richDocument state paths come from B's separate state-kinds freeze.
Only the additive richDocument kind/schema/createEntry branch and its exact
STATE-EDITOR-001 requirement are merged. NumberRange, fileList, panelLayout and
all previous kinds remain intact. Transport budgets stay unchanged.

## Review correction

EDITOR-DOC-005 forbids reading untrusted getters before the clone boundary.
The frozen preflight read array.length directly, which executed a get trap on
an array Proxy. A public editorDocumentSchema regression confirmed one property
read although safeParse rejected the document. The initial failing assertion
formatter also attempted to print the hostile proxy; an explicit numeric trap
counter then recorded the exact behavioral failure without invoking formatting.
Both failed logs are retained separately.

The corrected preflight reads own length data descriptors, validates a safe
nonnegative integral length, and reuses descriptor lookup for block-type data.
Spoofed descriptor lengths are rejected before enqueueing entries. No getters,
SDK classes or HTML become public document state. Structured cloning remains
the second boundary that rejects an otherwise reflected Proxy graph.

## Evidence

- editor-array-proxy-red-exact.log: expected zero reads, observed one.
- editor-array-proxy-green.log: six tests in two files pass after correction.
- editor-foundation-tests.log:18 tests across seven files pass, including
  document budget/schema/selection/portable-schema and richDocument registry.
- editor-foundation-coverage/coverage-summary.json: nine measured executable
  foundation/state-schema files reach100% statements, branches, functions and
  lines:130/92/22/112 respectively. Two type-only modules have no counters.
- editor-foundation-types.log: all four strict TypeScript7 projects pass.
- editor-foundation-policy.log: source policy passes.

Focused coverage does not claim full create-entry or repository coverage. The
new registry branch is exercised by the rich-document registry tests; complete
per-file coverage, typed lint, generated schema freshness, build/package,
browser and strict documentation checks remain in the final combined gate.

The narrow descriptor correction has its own immutable baseline/payload freeze
for B consumption. The complete foundation/state overlay is separate and must
be merged after Form2. Neither record marks Editor inventory entries Verified.
All operations remain local.
