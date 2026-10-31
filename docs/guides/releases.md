# Releases and package publication

reacd uses release-please to propose reviewed releases from English Conventional
Commits. The generated [changelog](../changelog.md) is the public release history. A
release PR updates the version, lockfile and changelog together. GitHub releases stay
private drafts until the same workflow verifies both published npm packages.

## Versions before 1.0

The first configured release is 0.1.0. Before 1.0, breaking changes bump the minor
version; ordinary features also bump minor, and fixes bump patch. Do not assume pre-1.0
minor versions are compatible. A GitHub release and an npm publication are separate
states; check the actual npm version before installing it.

The engine and adapter use one release version. Release-please updates the adapter
manifest and its exact engine peer with the root version. Version 0.2.0 separates the
adapter into its own package. Both packages share one version and one completion
operation; a GitHub-only release is incomplete.

## Verification and documentation artifacts

Pull requests and non-main branch pushes run Check directly. A main push runs the
Release workflow, which calls the same complete Check once before release work. It runs
source policy, strict types, lint, full coverage, package acceptance, built
documentation and browser acceptance. Failed checks prevent release work.

Hosted failures annotate the failed gate. Browser cases also emit GitHub check
annotations alongside the list and HTML reports. Failure still stops release work.

Successful verification uploads a docs-COMMIT_SHA Actions artifact containing the
complete generated site, compiled component previews and local assets. Artifacts are
retained for fourteen days. Download one, extract it and serve its directory with a
local HTTP server to inspect that exact documentation build.

An artifact is not a deployment. https://reacd.dev/ remains the canonical URL; this
pipeline does not configure hosting, publish Pages or change DNS.

## Creating a release

Organization and repository Actions policies must allow GitHub Actions to create and
approve pull requests. Keep the default workflow token permissions read-only; the
release job requests its own limited write permissions. An organization-level block
cannot be overridden by a repository setting or workflow YAML. An owner must enable the
policy before release-please can create its release PR.

If release-please reports that Actions cannot create or approve pull requests, check the
organization policy first, then the repository Actions settings. After an owner fixes
the policy, rerun the failed jobs of the original workflow. Do not remove release
automation, broaden default token permissions or add a personal access token to work
around the policy.

Merge reviewed features and fixes with Conventional Commit subjects such as feat: add a
control, fix: preserve focus, or feat!: change a contract. The bot keeps one release PR
current. Review the version and notes, allow its checks to finish, and merge it when a
GitHub release is intended.

A main-head preflight skips already superseded checks. It is not an atomic branch lock;
main can still move before the release action finishes. A merged release PR prepares a
draft and its immutable tag in the same workflow. Publication consumes the reported
release SHA instead of a moving main checkout or a later bot tag event.
GitHub-token-created PR checks may require a maintainer to approve their execution. An
explicitly configured GitHub App can later automate those checks; a broad PAT is not
required by the default setup.

## Recovering an interrupted release

Run the Release workflow manually on main and enter the existing tag, such as v0.2.0.
Recovery verifies successful complete Check jobs for both the immutable tag source and
its workflow implementation. It rejects a tag outside main history and checks out the
original source separately. Standard GitHub SHA variables are never overwritten. The
normal release path still requires its release SHA to equal this run's checked SHA.

The workflow compares existing GitHub archive digests before any npm upload. It then
uploads and verifies both exact npm archives, transfers the checked candidate to its
completion job, verifies npm again and makes the draft public. Failed publication or
verification leaves the draft private. Existing matching npm versions are verified and
reused on retry. A prepared candidate with publication disabled fails the release job.

## Enabling npm publication

Publication is off by default. The owner must complete the following setup before
setting the repository variable NPM_PUBLISH_ENABLED to the exact string true:

1. Establish both npm package names and their owner with authorized initial
   publications: @fastsprout/reacd and @fastsprout/reacd-shadcn. A missing registry
   entry does not guarantee the name can be claimed.
2. Verify the package metadata, exact tested host peers, clean installed consumer and
   complete distribution licenses from the checked release tarball.
3. Configure each package's trusted publisher for FastSprout, repository Reacd, workflow
   filename release.yml and GitHub environment npm. Explicitly allow direct npm publish;
   new publisher entries otherwise permit staging by default.
4. Configure the GitHub npm environment and any desired review protection. Allow Actions
   to create release PRs without bypassing the repository's required checks.
5. Enable publication only when an actual npm upload is authorized. No long-lived npm
   write token is needed; the publish job uses OIDC on a GitHub-hosted runner.

The npm account needs package ownership and 2FA. npm trust requires an existing package.
Staging a new name creates a publicly visible placeholder, so it is not a dry-run.
Bootstrap publication runs in GitHub Actions too. Before a new package can have an OIDC
publisher, provide a short-lived npm token with write access to the @fastsprout scope
and CI publication permission. Store it directly as the npm environment secret
NPM_TOKEN. Only the runner's publication step receives NODE_AUTH_TOKEN; neither the
source nor the completion job receives that npm credential. The environment permits main
only. Remove the bootstrap secret after both packages have working OIDC trust.

Do not publish locally or paste a token into chat. npm publication still uses the exact
checked archives and the same registry verifier. Configure a trusted publisher near the
intended release: a new trust entry must complete its first successful publish within
npm's documented lifetime.

## What the publish job verifies

The non-OIDC release job first checks the raw publication variable with a quoted,
case-sensitive Bash comparison. Only literal true emits a trusted enabled output; TRUE,
surrounding whitespace and every other input emit false. The capability job uses that
canonical output because [GitHub expressions][expr] ignore case when comparing strings.
The CLI verifier still receives the raw variable and enforces its strict value.

The publish job starts only for a newly created release with explicit enablement and an
action-output SHA equal to this run's verified SHA. This condition applies before
checkout or any OIDC-capable dependency install/build from that source. The later source
verifier is defense in depth. Both complete Check and publish install npm 11.19.0
immediately after setup-node to match the tested CLI pin. The job checks out the
reported SHA, installs the lockfile cleanly, builds and runs packed-consumer acceptance.
release:verify checks the SHA against this run's verified commit, actual tag/main
ancestry, version and publication prerequisites. Runner OIDC variable presence does not
prove npm has authorized that workflow; actual registry authentication still happens
during publication. release:pack emits the checked .cache/release/package.tgz and
.cache/release/shadcn.tgz. npm uploads those exact archives with public access, engine
first and adapter second. A changed identity or failed check stops the job. The registry
verifier confirms both exact versions and downloaded archive SHA-512 values before
reporting success. npm does not provide an atomic two-package publication: an
interrupted upload may leave only the engine published.

release:publish checks each exact public version before uploading. A missing version may
be uploaded; an existing version is skipped only after its downloaded archive matches
the checked bytes. Network failures, conflicting metadata and different archive digests
stop publication. After a partial upload, rerunning the original checked job verifies
the existing engine and uploads only the missing adapter. Staged or unverified versions
never count as a completed release.

Packing uses isolated publication workspaces. Each package's source README is copied
unchanged. Development scripts, development dependencies and local package manager
configuration are omitted from consumer manifests. Package acceptance installs the same
checked archives that release publication uploads.

Never substitute a package glob, disable a gate or overwrite an existing version to
recover a failed release. An authorized maintainer can investigate the exact failed
publish job and rerun that original job with its original release identity. A skipped
publish job is not a successful npm publication. A GitHub draft becomes public only
after the completion job confirms both public npm versions and their archive bytes. The
initial disabled bootstrap release remains owner-managed, not an automatic or silently
verified upload. Later publication must use the same controls.

A local pack/dry-run or a saved OIDC configuration does not prove npm publication.
Verify the public version and matching tarball integrity after upload. A staging
placeholder is an intermediate state. For an OIDC release, verify its provenance as
well. The initial 0.1.0 package was published by its maintainer and downloaded bytes
were verified; this does not establish that automated OIDC is configured.

Official references: [release-please][release], [npm trusted publishing][npm], and
[GitHub workflow triggers][triggers].

[release]: https://github.com/googleapis/release-please-action
[npm]: https://docs.npmjs.com/trusted-publishers/
[triggers]: https://docs.github.com/actions/using-workflows/triggering-a-workflow
[expr]: https://docs.github.com/en/actions/reference/workflows-and-actions/expressions
