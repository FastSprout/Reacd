# Agent B correlated Mention lookup foundation

Date: 2026-10-29. Source: fork-b. Scope: MENTION-LOOKUP-001 through MENTION-LOOKUP-006.
This is schema/pure-controller verification; native integration and browser acceptance
remain Chat/parent-owned. All included paths are new.

Canonical item.schema.ts extracts the existing id/label/disabled contract without a
primary/lookup cycle. It exports editorMentionItemSchema, editorMentionItemsSchema and
EditorMentionItem. Catalogs retain unique ids, provider order and the existing 100-item
budget. Label normalization matches the existing canonical item schema.

Lookup.schema.ts exports request/result schemas, inferred EditorMentionLookupRequest and
EditorMentionLookupResult, plus scope/query validators for the private controller.
Requests are readonly key/query. Query is exact and untrimmed, including empty query.
Strict result variants echo both fields: loading; ready with canonical items; error with
bounded nonempty text. Derived core policies own scope80/key1000/query128/error1000.
Scope/key are opaque strings; React useId colons are supported, not rewritten as state
keys. Only validated result DTOs enter the controller from primary component props.

createMentionLookupController(scope) keeps the agreed update(query,result|null)/close()
ABI. Update returns readonly request|undefined, status, items and error|undefined. A
request is returned once per changed query/open cycle. BigInt ordinals are local and
persist across close; no global counter, clock, randomness or precision wrap is used.
Both key and exact query must match. A/B/A, reopened requests, mismatched queries and
stale/null props cannot replace accepted current data. Ready/error survive late matching
loading, while matching terminal results can replace each other for host-owned retry.
Ready items are authoritative fuzzy results and are never locally filtered or reordered.

The pure advanceMentionLookup state transition makes finite key-budget exhaustion
exercisable with an explicit bigint snapshot, without adding factory seed options or
mocking a controller branch. Generated keys use safeParse; exhaustion, malformed scope
and oversized query yield bounded error views without requests or throws. Invalid cycles
clear current/cache; ordinal remains private and is never part of the public view.

No network, SDK, DOM, React hook, rendering or application callback is used in this
foundation. Chat owns existing primary schemas/props/indexes, local-only generative
transport, hook/store/panel/context/native wiring and exact callback timing. Calendar
owns the honest response-simulation docs/example and browser acceptance.

Red missing-module acceptance is .cache/mention-lookup-before.log. Eight tests in two
files pass in .cache/mention-lookup-coverage.log. All four executable owned files reach
100% statements, branches, functions and lines: 40 statements, 24 branches, nine
functions and 39 lines. Report: .cache/coverage-mention-lookup/coverage-summary.json.
Unchanged global coverage thresholds also report unrelated unexercised files and exit 1;
no paths or thresholds were hidden or lowered.

Strict scoped TS7 passes in .cache/mention-lookup-types.log, using the noEmit
configuration mention-lookup-tsconfig.json in .cache. It inherits the full root
strict/exact settings and checks every owned source/test plus their imported
dependencies. No-ignore typed lint passes with zero diagnostics across six files in
.cache/mention-lookup-lint.json. Parent owns the later whole-project integration gate
while native wiring is in progress.

Maintained owned files satisfy 300 lines, 88 columns and two spaces. Generated cache
reports/config retain tool formats. No existing source, package, aggregate or output
build was modified by this batch. All work remains local; no commits, remote writes,
publication, deployment or DNS changes.
