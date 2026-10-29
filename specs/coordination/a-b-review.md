# A and B implementation review

Status: review protocol prepared; final reviews have not run.

The user requested a code review of both implementation streams, a requirements
check, and corrections after implementation. This applies to the combined local
candidate. The accepted A checkpoint does not by itself complete that request.

## Comparison boundary

Original immutable baseline:
`.cache/batches/review-root-baseline/manifest.json` in the root checkout.
It records 1,032 maintained paths and their SHA-256 hashes. A fresh audit on
2026-10-29 confirmed all original root files still match. There are no commits
or remote operations in this workflow. Compare file contents against this
baseline rather than treating untracked source as an empty Git diff.

Freeze the complete combined candidate before independent review. Record its
exact hashes and the required acceptance logs. Reviewers must read that frozen
candidate; ongoing worker edits cannot silently change the reviewed result.

## Standards review

Use an independent reviewer with AGENTS.md and affected architectural decisions.
Check dependency direction, closed application APIs, per-component ownership,
state isolation, trusted rendering boundaries, logical callback arguments and
named behavior policies. Tool-enforced formatting/type rules are verified by
checks and need not become duplicate manual findings.

Also consider Fowler's naming, duplication, feature envy, data clumps, primitive
obsession, repeated switches, shotgun surgery, divergent change, speculative
generality, message chains, middle man and refused bequest heuristics. These are
judgment calls; documented repository architecture overrides them. A deliberately
exhaustive registry is not automatically a defect because it uses dispatch.

Report hard rule violations separately from judgment calls, with file/line,
concrete failure or maintenance consequence, and the applicable documented rule.

## Specification review

Use a separate reviewer with specs/index.md, specs/catalog/nuxt-ui.md, affected
component requirements, state/adapter contracts and the user's requirements.
Report missing, partial, incorrect or unrequested behavior. Cite requirement IDs
and exact evidence. Distinguish declared behavior, implemented behavior and
verified browser behavior. Schema success does not prove visual correctness.

Trace every inventory entry to its closed TSX module, schema, shadcn adapter,
compiled reference/example and acceptance evidence. Legacy aliases must preserve
compatibility and be explained rather than counted as missing by name alone.
Optional generative nodes need complete visitor, binding and action integration.

## Corrections and final acceptance

Each confirmed defect gets an affected requirement update and failing regression
before code changes. Freeze narrow corrections with baseline/payload hashes.
After merging corrections, run the required strict types, typed lint, source
policy, schema/example freshness, all-file coverage, build/bundle budgets,
packed consumer, browser conformance and strict MkDocs checks.

Do not lower limits, suppress diagnostics, exclude runtime paths, change test
assertions to hide defects, or mark unresolved entries Verified. Preserve failed
attempts and distinguish infrastructure failures from functional regressions.
Report the two review axes separately, their corrected findings and remaining
limitations. Keep the reviewed final artifact local and immutable.
