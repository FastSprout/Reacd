# Correlated remote Mention lookup

Status: schemas/controller verified in B snapshot; native integration remains pending.
Adds remote TSX Mention lookup alongside the existing literal local catalog. Chat owns
primary component/menu integration; this scope owns new data schemas and a pure lookup
controller. Literal JSON transport remains local-only.

MENTION-LOOKUP-001: Extract the existing canonical readonly mention item schema into
item.schema.ts, preserving id, normalized label and optional disabled. Share its bounded
unique-id catalog between local and remote contracts without a primary/lookup import
cycle. Reuse the existing menu catalog/query budgets and named core error/key budgets.

MENTION-LOOKUP-002: Local properties are exactly label/items/disabled. Remote properties
are exactly label/results/onQueryChange/disabled, with no items property. A readonly
request contains opaque bounded key and exact bounded query. Empty query is valid; do
not trim, normalize or case-fold it. Results echo both key and query and are one strict
readonly status variant: loading; ready with bounded unique canonical items; or error
with nonempty bounded text. Unknown statuses, metadata and mixed variant fields are
invalid. No network client, SDK objects or render callbacks enter these contracts.

MENTION-LOOKUP-003: createMentionLookupController(scope) is a pure private adapter
helper. Its update(query,result|null) returns readonly request|undefined, status
loading|ready| error, readonly items and error|undefined. close() clears the active
request/result but preserves the local ordinal. Scope is an opaque React useId string
and can contain colons; it is not constrained to the state-key alphabet. No global
counter, clock, randomness, network, SDK, DOM or application callback is used in this
controller.

MENTION-LOOKUP-004: Emit one request for each changed query/open cycle. Deterministic
scope-plus-ordinal keys distinguish A to B to A and close/reopen cycles. Only results
matching both current key and exact query are accepted. Ignore mismatched responses and
null props while retaining already accepted current data. Without a current match,
return loading with no selectable items. Closing or an invalid query invalidates the old
cache, so an earlier result cannot revive on the next valid cycle.

MENTION-LOOKUP-005: Accepted ready/error results cannot regress to late same-key
loading. A later matching ready/error may replace either terminal status, supporting
host-owned retry completion. Ready items are authoritative fuzzy matches and preserve
provider order; no substring filtering or reranking occurs here. Empty ready differs
from loading. Malformed/oversized scope or query returns a bounded error view and no
request, not a thrown exception or callback. Public result data is schema-validated
before integration.

MENTION-LOOKUP-006: Acceptance precedes code. Test strict status/item schemas, budgets,
immutability and exact queries; deterministic isolated controllers, once-only requests,
A/B/A and reopen stale responses, accepted-data retention, terminal transitions, fuzzy
items and invalid input. Require 100% owned runtime statements, branches, functions and
lines, strict TS7, no-ignore lint and 300-line/88-column/two-space maintained files.
Generated key-budget exhaustion also yields a bounded error without reusing a key. A
pure private state transition accepts an explicit ordinal for meaningful exhaustion
acceptance; the component-facing factory still takes only its scope string. Native
callback timing/loading/focus/protection and browser acceptance are Chat/parent
integration gates; pure-controller tests do not establish rendered UI correctness.
