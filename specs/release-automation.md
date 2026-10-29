# Release automation

Status: specified before implementation, 2026-10-29. This extends the accepted
local enterprise checkpoint; historical local-only verification remains unchanged.

## Session authorization

RELEASE-001: The user's later instruction authorizes pushing the finished work to
main, then committing/pushing automatic changelog, documentation and npm pipeline
changes. This explicitly supersedes the earlier no-push session restriction for
those main updates. Root owns git operations. It does not authorize an actual npm
publication, package-name claim, service setting, Pages deployment or DNS change.

## Package readiness

RELEASE-002: The publishable manifest has private false, canonical git repository
https://github.com/FastSprout/Reacd, homepage https://reacd.dev/, the repository
issue URL, and explicit public npm registry/access settings. Source/package exports
stay closed. Keep Node >=26; no lower runtime compatibility is claimed.

RELEASE-003: React 19.3.1, ReactDOM 19.3.1 and Jotai 3.0.1 are exact host peers and
exact local dev dependencies. Do not widen ranges or claim other host versions.
A real packed-consumer install must resolve one host instance for each dependency;
symlinking the repository installation alone is insufficient publication evidence.

RELEASE-004: The actual tarball contains the full upstream shadcn MIT notice and
project LICENSE, compiled exports/declarations/CSS, both transport schemas and
README. Exclude tests, fixtures, internal specs, secrets, caches and source maps.
Packed acceptance checks these contents before any upload. New owned executable
packaging tools retain per-file 100% coverage in all four metrics.

## Automated version and documentation flow

RELEASE-005: Use pinned release-please v5 with Node strategy, one root package and
v-prefixed tags without a component prefix. Start with an empty release manifest,
initial version 0.1.0 and bootstrap SHA
926abba865790d93fde8e5e22e18f717d4ff878e. The marker precedes the completed feature
commit. Before 1.0, breaking commits bump minor; ordinary features also bump minor,
and fixes bump patch. Document that pre-1.0 breaking releases are possible.

RELEASE-006: The one generated changelog is docs/changelog.md, reachable from MkDocs
navigation. Release PRs update version, lockfile and changelog together. English
Conventional Commit subjects drive user-facing notes. Exact generated changelog
formatting is exempted from 300/88 by its documented policy entry, never by a
runtime coverage exclusion. Internal specs remain outside public docs.

RELEASE-007: Complete Check is reusable and still runs npm run check without
omitting tests, coverage, strict docs or browser cases. PRs and non-main branch
pushes use Check directly. Main pushes use the release orchestrator's Check call,
so one main commit does not start duplicate complete verification workflows.
A failed Check prevents this run's release job. The preflight catches already stale
main runs, but release-please can still create GitHub metadata for a later live
main commit. The hard npm upload invariant requires its reported SHA to equal this
run's verified commit, actual checkout HEAD and tag target.

Local and hosted unit execution defaults to two workers, matching the accepted
full coverage runs. The first hosted main run exposed an immediate Select reopen
race in Modal's test; await the actual selection/closed state and accessible
popup on reopening. Preserve its retained-host and child-portal assertions, with
unchanged timeouts, retries, coverage thresholds and complete test discovery.

RELEASE-008: Successful verified builds upload the complete site/ as a commit-named
Actions artifact, including compiled live previews, root-relative public assets
and local fonts. Retain artifacts for fourteen days; missing files fail the job.
Artifact upload is not site hosting, Pages deployment or DNS configuration.
Canonical URL stays reacd.dev.

## Release and npm publication boundary

RELEASE-009: After successful main verification, release-please creates/updates its
reviewable release PR. A merged release PR allows the same workflow to create its
GitHub release/tag. Pass its release_created, sha, version and tag_name outputs to
a dependent publish job rather than relying on bot-created tag/release events to
start another workflow. A stale-main preflight is advisory, not an atomic branch
lock: the pinned action exposes target-branch but no target-SHA input. Publish
identity validation must reject a release SHA differing from this run. Default
GITHUB_TOKEN bot PR checks may need approval; fully automatic checks may later
use a narrowly scoped GitHub App installation.

RELEASE-010: The publish job cannot start unless NPM_PUBLISH_ENABLED is exactly
true, a real root release was created and the action-output SHA equals this run's
verified github.sha. This job-level guard precedes checkout, dependency install,
build and all OIDC-capable execution. The later source verifier remains defense
in depth. Only a GitHub-hosted publish job gets
id-token write; other jobs cannot publish. Check out the exact release SHA with
full tag history, use a clean lockfile install and disable dependency caching in
that capability-bearing job. Use OIDC, not a long-lived npm write token.

RELEASE-011: Before upload, npm run release:verify validates expected RELEASE_SHA,
RELEASE_TAG and RELEASE_VERSION against the actual checkout, tag target, main
ancestry and package metadata. It also verifies publication prerequisites. These
values enter through environment variables, never interpolated shell code.
Malformed/mismatched identity, missing artifacts and auth errors fail closed.

RELEASE-012: npm run release:pack emits the verified distributable at the fixed path
.cache/release/package.tgz. Publish exactly that checked tarball with public access;
never publish an arbitrary glob or a different moving main checkout. Build and
npm run test:package precede this operation. npm versions are immutable; failure
is not permission to overwrite or silently mark a different package as published.

Before the fixed output is created, verify SHA-512 integrity, the actual tar member
allowlist with no duplicate/nonregular entries, embedded publication identity, and
the full project LICENSE and unchanged upstream MIT notice. Never extract archive
paths onto the filesystem. Remove temporary work and stale final output on failure;
only a fully checked archive is moved atomically to the fixed publication path.

RELEASE-013: Root owns release:verify/release:pack implementations and their tests.
OIDC requires npm >=11.5.1. Both complete Check and publish jobs explicitly install
npm 11.19.0 immediately after setup-node, matching the tested packageManager pin.
The npm trusted publisher must name FastSprout, Reacd, release.yml and its matching
optional environment. Direct npm publish must be explicitly allowed. Account,
2FA, initial package bootstrap and trust configuration remain external owner work.
A newly configured trust entry must first succeed within its documented lifetime.
Runner OIDC variable presence proves only a capability prerequisite, not npm trust
or permission to publish. Standard GITHUB and ACTIONS identity variables reach the
verifier from the runner; NPM_PUBLISH_ENABLED is explicitly passed from the variable.

RELEASE-014: A missing registry package is not a claimability guarantee. npm trust
requires an existing package. Staging a new package publicly creates a placeholder;
it is not a dry-run. The initial disabled/bootstrap release is owner-managed.
A skipped publish job is not verified publication or consent to bootstrap. No
bootstrap publish/stage or service setup runs as part of pipeline implementation.
Do not report OIDC publication as verified without an authorized real registry
result and provenance evidence.

## Ownership and acceptance

Root owns package manifests, licensing/peer and packed-consumer tooling, publication
identity helpers, generated-changelog policy, README and git operations. The release
worker owns this spec, check/release workflows, release-please configuration and
manifest, public changelog/release guide and MkDocs navigation only.

RELEASE-015: Static acceptance validates YAML/JSON syntax, pinned actions, required
job permissions, main/PR trigger separation, the disabled publication condition,
release SHA wiring, artifact paths and documentation links. Root runs the required
local checks and inspects actual GitHub Actions results after pushing. Static
validation is not GitHub execution or an npm authentication test.

References: npm trusted-publishers, npm-trust and npm package-json documentation;
GitHub trigger-a-workflow and workflow artifact documentation; release-please v5
and its manifest-releaser guide. Detailed dated primary-source research is stored
outside docs at .cache/coordination/agent-a/release-plan.md.
