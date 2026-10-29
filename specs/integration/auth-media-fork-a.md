# Auth/media integration checkpoint

The sole fork-a writer imported the immutable auth-media batch into this isolated
snapshot. The root checkout and frozen evidence remain unchanged.

## Import review

- Verified every frozen source SHA256 before copying the 47 new paths.
- Four shared paths matched their recorded baselines exactly: FormSurface,
  framework diagnostics, EditorialImage and editorial policy. Reviewed their private
  form nesting guard and shared SafeImage deltas before importing them.
- Manually merged thirteen aggregate proposals. CompositionCatalog owns the two named
  prop contracts; CompositionNodeView routes both generative types. Main node dispatch
  stays unchanged. Existing ContentSearch, Dashboard, menu, B state and leaf cases
  remain present.
- Preserved prior callback argument hardening, scoped direction, pagination URL/veto,
  native control bridges and all renderer/state/schema refactors.
- Added AuthForm/PageLogos links to the public component index. No internal specs were
  placed in public documentation.
- Regenerated both JSON schema artifacts; their required generated formats remain
  covered by existing source-policy exclusions. No exclusions or thresholds changed.

## Cheap integrated checks

Strict types, source policy, schema generation and schema freshness passed. Logs:
`.cache/auth-media-integration-{types,policy,schema,schema-check}.log`.

The focused component/example/SSR/hydration/transport and exhaustive adapter suite
passed 137 tests in 16 files, including exact adapter coverage of all 110 current
public component names. Log: `.cache/auth-media-integration-unit.log`.

The frozen batch separately records 24 executable files at 100% in all four metrics
and sixteen production Chromium scenarios. The previously passed combined baseline
had 108 components, 1,307 tests across 419 files, 818 executable files at 100% and 484
Chromium scenarios. Neither baseline evidence nor isolated evidence is a claim that
the newly merged snapshot has passed a fresh combined gate.

Toast and the final ContentNavigation/ContentToc delivery remain separate integrations.
Wait for those deliveries before the next complete combined gate. Inventory acceptance
remains with the parent agent after that gate.

Subsequent checkpoint: ContentNavigation/ContentToc and B's frozen Button/User logical
callback correction are now merged. A portal-aware private boundary supersedes the
initial conservative guard; see `form-portal.md`. Full combined acceptance is still
pending Toast and the final gate.
