# Releases and package publication

reacd uses release-please to propose reviewed releases from English Conventional
Commits. The generated [changelog](../changelog.md) is the public release history.
A release PR updates the version, lockfile and changelog together.

## Versions before 1.0

The first configured release is 0.1.0. Before 1.0, breaking changes bump the minor
version; ordinary features also bump minor, and fixes bump patch. Do not assume
pre-1.0 minor versions are compatible. A GitHub release and an npm publication
are separate states; check the actual npm version before installing it.

## Verification and documentation artifacts

Pull requests and non-main branch pushes run Check directly. A main push runs the
Release workflow, which calls the same complete Check once before release work.
It runs source policy, strict types, lint, full coverage, package acceptance, built
documentation and browser acceptance. Failed checks prevent release work.

Hosted failures annotate the failed gate. Browser cases also emit GitHub check
annotations alongside the list and HTML reports. Failure still stops release work.

Successful verification uploads a docs-COMMIT_SHA Actions artifact containing the
complete generated site, compiled component previews and local assets. Artifacts
are retained for fourteen days. Download one, extract it and serve its directory
with a local HTTP server to inspect that exact documentation build.

An artifact is not a deployment. https://reacd.dev/ remains the canonical URL;
this pipeline does not configure hosting, publish Pages or change DNS.

## Creating a release

Merge reviewed features and fixes with Conventional Commit subjects such as
feat: add a control, fix: preserve focus, or feat!: change a contract. The bot keeps
one release PR current. Review the version and notes, allow its checks to finish,
and merge it when a GitHub release is intended.

A main-head preflight skips already superseded checks. It is not an atomic branch
lock; main can still move before the release action finishes. A merged release PR
can create its GitHub tag/release in the same workflow. Publication consumes the
reported release SHA instead of a moving main checkout or a later bot tag event.
GitHub-token-created PR checks may require a maintainer to approve their execution.
An explicitly configured GitHub App can later automate those checks; a broad PAT
is not required by the default setup.

## Enabling npm publication

Publication is off by default. The owner must complete the following setup before
setting the repository variable NPM_PUBLISH_ENABLED to the exact string true:

1. Establish the npm package name and owner with an authorized initial publication.
   A missing registry entry does not guarantee the name can be claimed.
2. Verify the package metadata, exact tested host peers, clean installed consumer
   and complete distribution licenses from the checked release tarball.
3. Configure a trusted publisher on npm for owner FastSprout, repository Reacd,
   workflow filename release.yml and GitHub environment npm. Explicitly allow
   direct npm publish; new publisher entries otherwise permit staging by default.
4. Configure the GitHub npm environment and any desired review protection. Allow
   Actions to create release PRs without bypassing the repository's required checks.
5. Enable publication only when an actual npm upload is authorized. No long-lived
   npm write token is needed; the publish job uses OIDC on a GitHub-hosted runner.

The npm account needs package ownership and 2FA. npm trust requires an existing
package. Staging a new name creates a publicly visible placeholder, so it is not
a dry-run. Neither bootstrap publication nor service settings are automated here.
Configure a trusted publisher near the intended release: a new trust entry must
complete its first successful publish within npm's documented lifetime.

## What the publish job verifies

The non-OIDC release job first checks the raw publication variable with a quoted,
case-sensitive Bash comparison. Only literal true emits a trusted enabled output;
TRUE, surrounding whitespace and every other input emit false. The capability job
uses that canonical output because [GitHub expressions][expr] ignore case when
comparing strings. The CLI verifier still receives the raw variable and enforces
its strict value.

The publish job starts only for a newly created release with explicit enablement
and an action-output SHA equal to this run's verified SHA. This condition applies
before checkout or any OIDC-capable dependency install/build from that source.
The later source verifier is defense in depth. Both complete Check and publish
install npm 11.19.0 immediately after setup-node to match the tested CLI pin.
The job checks out the reported SHA, installs the lockfile cleanly, builds and
runs packed-consumer acceptance. release:verify checks the SHA against this run's
verified commit, actual tag/main ancestry, version and publication prerequisites.
Runner OIDC variable presence does not prove npm has authorized that workflow;
actual registry authentication still happens during publication.
release:pack emits the checked .cache/release/package.tgz; npm uploads that exact
archive with public access. A changed identity or failed check stops the job.

Never substitute a package glob, disable a gate or overwrite an existing version
to recover a failed release. An authorized maintainer can investigate the exact
failed publish job and rerun that original job with its original release identity.
A skipped publish job is not a successful npm publication. The initial disabled
bootstrap release remains owner-managed, not an automatic or silently verified
upload. Later publication must use the same controls.

A local pack/dry-run or a saved OIDC configuration does not prove npm publication.
Only a successful authorized upload, matching registry version/integrity and its
provenance provide publication evidence. This setup makes no such claim yet.

Official references: [release-please][release], [npm trusted publishing][npm], and
[GitHub workflow triggers][triggers].

[release]: https://github.com/googleapis/release-please-action
[npm]: https://docs.npmjs.com/trusted-publishers/
[triggers]: https://docs.github.com/actions/using-workflows/triggering-a-workflow

[expr]: https://docs.github.com/en/actions/reference/workflows-and-actions/expressions
