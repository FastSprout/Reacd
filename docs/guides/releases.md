# Releases and package publication

reacd uses release-please and English Conventional Commits. A release PR updates
versions, the lockfile and [changelog](../changelog.md) together. Before 1.0, breaking
changes and features bump minor; fixes bump patch.

## One version across three packages

From 0.3.0, a release contains:

- `@fastsprout/reacd`: the headless engine.
- `@fastsprout/reacd-shadcn`: the complete shadcn/ui adapter.
- `@fastsprout/reacd-mui`: the complete Material UI adapter.

Each adapter declares an exact peer on the same engine version. Release-please updates
both adapter versions and engine peers. Version 0.2.0 introduced the separate shadcn
package; 0.3.0 adds Material UI and changes the toolchain to Node.js 22. The repository
pins Node.js 22.23.4 and npm 11.19.0. Supported Node versions start at 22.12.0.

## Checks before publication

Pull requests and non-main pushes run Check. Main pushes run Release, which calls the
complete Check before release work: source policy, architecture, strict types, lint,
schema and fixture validation, full coverage, build, installed-package acceptance,
documentation and browser conformance. Failures stop the release.

Successful checks upload a `docs-COMMIT_SHA` artifact containing the generated MkDocs
site, live previews and local assets. Serve that artifact locally to inspect the checked
build. Artifacts expire after fourteen days.

An artifact is not a deployment. `https://reacd.dev/` is the canonical URL; this
workflow does not publish hosting or change DNS.

## Preparing a release

Organization and repository Actions policies must allow Actions to create and approve
pull requests. Default token permissions remain read-only. The release job requests its
own limited write permissions. An organization block cannot be overridden by the
repository's workflow.

Merge reviewed Conventional Commits, review the bot's release PR, and merge it when a
release is intended. A main-head preflight skips superseded checks. It is not an atomic
branch lock. The workflow prepares a private draft and immutable tag, then uses the
checked release SHA rather than a moving main branch.

Bot-created PR checks may need maintainer approval. Do not bypass the policy with
broader default token permissions or an unrelated personal access token.

## npm publication and completion

Set the repository variable `NPM_PUBLISH_ENABLED` to literal `true`. Missing, uppercase
or whitespace-padded values disable publication. The CLI also verifies this value, the
checked SHA, tag ancestry, version and runtime prerequisites.

Configure npm authentication for every release-owned package. A new package may require
a short-lived scoped write token with the required 2FA permissions in the `npm`
environment's `NPM_TOKEN` secret. Trusted publishing requires npm to authorize this
repository and workflow; OIDC runner variables alone do not prove that authorization.

The job installs the lockfile, builds and verifies isolated consumers. Packing copies
each source README unchanged and strips development scripts, dependencies and
package-manager configuration from published manifests. npm receives the same checked
archives used in acceptance:

- `.cache/release/package.tgz`
- `.cache/release/shadcn.tgz`
- `.cache/release/mui.tgz`

Publication checks each exact public version. Missing versions are uploaded; existing
versions are accepted only after metadata and downloaded archive bytes match. Scanning
or staged placeholders are polled within a bounded availability window. Conflicting
metadata, network failures and different digests stop the job. No existing npm version
is overwritten.

npm does not offer an atomic multi-package upload. A failure can leave part of a release
published. The GitHub release remains a private draft until all three versions and
archive SHA-512 digests are confirmed. A separate completion job verifies npm again,
confirms the GitHub archive digests and makes the draft public. Local packing does not
prove publication.

## Recovering an interrupted release

Run Release manually on main with the existing checked tag, such as `v0.3.0`. Recovery
verifies successful complete Check jobs for both the tag source and workflow source,
checks main ancestry, and builds the immutable original source separately. Standard
GitHub SHA variables are never overwritten.

Current recovery accepts 0.3.0 and later tags. Older tags use historical Node.js 26
policy and are rejected before any GitHub API request or draft mutation. Published
historical assets remain unchanged.

For a supported tag, recovery compares existing GitHub digests before upload, verifies
matching npm versions and uploads only missing archives. Completion still requires every
package. Do not replace archives with a glob, disable checks or overwrite an existing
version to recover a failure.

References: [release-please][release], [npm trusted publishing][npm], and [GitHub
workflow triggers][triggers].

[release]: https://github.com/googleapis/release-please-action
[npm]: https://docs.npmjs.com/trusted-publishers/
[triggers]: https://docs.github.com/actions/using-workflows/triggering-a-workflow
