# Release automation verification

Date: 2026-10-29. This record extends the accepted enterprise checkpoint.
Its historical local-only record remains unchanged. The later user instruction
authorizes the completed source push and the release-automation push to main.
It does not authorize an npm upload, package bootstrap, hosting or DNS changes.

## Source and review boundary

The completed framework was integrated and pushed as
5a2ff6b6e752e84f5ccd80010e90e88584b0671c. Release changes are reviewed against
that exact commit, not an unpinned moving branch.

The 42-path release candidate is frozen in
.cache/release-candidate/manifest-v1.json, SHA-256
ce70fd8ac5e2f2b57e881f7d91f183c4d8bc6fe4834996d57dbe2d046273709f.
This verification record is subsequent bookkeeping, not a runtime change.

Independent Standards and Spec reviews report no confirmed findings. Both checked
the candidate's source hashes. Their reports and provenance are retained at
.cache/reviews/release-standards/v1.md and
.cache/reviews/release-spec/v1.md. Review is separate from executing checks.

## Local acceptance

The unfiltered default two-worker coverage run passes 2,923 tests in 917 files.
All 1,414 executable files have per-file 100% statement, branch, function and line
coverage: 10,584 statements, 7,549 branches, 3,292 functions and 9,541 lines.
The 390 empty/type-only files remain separately reported. No runtime coverage
exclusion, threshold, timeout, retry or test-discovery scope was relaxed.

Evidence: .cache/release-full-coverage.log and
.cache/release-full-coverage-summary.json. The recorded duration is 476.12 seconds.
Expected jsdom scrollBy diagnostics remain visible; they are not browser evidence.

Source/architecture policy, four strict TypeScript projects, typed lint, schema
freshness and example freshness pass. The ordinary production build passes with
22 JavaScript chunks and an unchanged largest chunk of 450,036 bytes. Strict
MkDocs and the compiled live-preview asset build pass.

Logs use .cache/release-policy-verified.log, .cache/release-typecheck-verified.log,
.cache/release-lint-verified.log, .cache/release-schema-final.log,
.cache/release-examples-final.log, .cache/release-build-final.log and
.cache/release-docs-final.log.

The actual packed-consumer check passes strict positive/negative TSX fixtures,
closed exports, SSR and state acceptance. Its additional clean npm installation
installs 129 packages from the real tarball, resolves shared React/ReactDOM/Jotai
hosts and verifies isolated SSR stores. It does not rely on repository dependency
symlinks for that installation. Log: .cache/release-package-final.log.

The actual release pack passes SHA-512, npm metadata, member allowlist, duplicate
and regular-file checks, embedded manifest identity and complete LICENSE/unchanged
upstream MIT notice checks. The verified local archive has 3,199 files and 506,500
bytes. Evidence: .cache/release-pack-final.log and
.cache/release-archive-final.json. Temporary failure cleanup and stale-output
removal are covered. This local archive is not an npm publication.

## Workflow acceptance

The official checksum-verified actionlint 1.7.12 binary accepts both workflows.
Its download identity is recorded in .cache/actionlint/download.json; the successful
diagnostic log is .cache/release-actionlint.log.

All 54 structural checks pass against the pinned official action input metadata.
All three extracted Bash preflight cases pass: current SHA, superseded SHA and
fetch failure. Evidence is retained under
.cache/coordination/agent-a/release-implementation/ in static-validation.json and
preflight-cases-final.json. These checks do not execute GitHub expressions or npm
authentication. The source verifier has separate temporary-git and negative tests.

Only the exact generated docs/changelog.md path receives release-tool formatting
exemption. Public docs contain the release guide and changelog; internal specs and
verification remain outside docs. Successful complete Check uploads site/ as a
commit-named artifact. It does not deploy reacd.dev.

The publish job requires a newly created release, explicit enablement and a release
SHA equal to the checked workflow SHA before checkout or OIDC-capable execution.
Later verification checks HEAD, tag, main ancestry, version and clean source.
Only that job has id-token write. Publication uses the fixed verified tarball.
The advisory main-head preflight does not claim to lock the branch atomically.

## Browser and hosted evidence

The original accepted checkpoint has 1,042 passing Chromium scenarios with two
workers and zero retries. A comparison of 1,999 production/browser/fixture/example
paths against the first main commit finds no byte differences for this release
extension. Evidence: .cache/release-ui-identity.json. New release pages are covered
by strict MkDocs acceptance; this extension does not claim new browser coverage.

The first source-only GitHub Check, run 40958495916, failed on Modal's immediate
Select reopening assertion. Its actual check annotations are retained under
.cache/coordination/agent-a/release-ci/. The repaired test waits for selection and
closed state, then the accessible popup. Retained-host and child-portal assertions
remain active; the complete local run above passes the repaired test.

The automation commit's hosted workflow result must be inspected after its push.
It runs complete Check, including browser acceptance, before release work. Local
success, static workflow validation and source review are not a hosted result.
Post-push run/job/annotation evidence belongs in the same release-ci cache.

## External setup and limits

No npm package was published or staged, no owner/trust entry was configured and no
publication enablement variable or GitHub environment setting was changed here.
There is no long-lived npm write token. Owner bootstrap, 2FA, exact trusted-publisher
configuration and explicit publication enablement remain external setup.

Runner OIDC prerequisites do not prove npm authorization. A skipped publish job is
not publication. A missing registry entry is not a package-name reservation.
Actual publication requires authorized registry/provenance evidence. Hosting,
Pages and DNS remain unchanged. Coverage and schema success do not establish
correct rendering in every browser or for every possible application.
