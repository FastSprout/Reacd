# Contributing

Use Node.js 22.12+, TypeScript 7 and two-space indentation. Keep maintained files within
300 lines and 88 columns. Tests belong beside their modules.

## Architecture

```text
core <- schema <- components <- renderer <- adapter <- state
```

Dependencies point left. Application views use closed TSX components from
`@fastsprout/reacd`; native rendering and CSS belong to trusted framework layers. Each
component owns its props, schema, adapter and tests. Public facades only re-export
modules.

```sh
npm run lint:layers
npm run typecheck
npm run lint
```

The layer linter checks imports, re-exports, aliases and dependency cycles. Computed
imports and production dependencies on tests fail validation.

## Changes and verification

Keep working specifications in local, gitignored `specs/`. Define the affected contract,
write a failing acceptance test, implement it and record the result. Public guides and
runnable component examples belong in `docs/` and `examples/`.

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
```

The complete check includes layer rules, strict types, lint, fixture/schema freshness,
per-file coverage, builds, installed-package acceptance, the Markdown site generator
and browser conformance.
Keep 100% statement, branch, function and line coverage for every owned runtime file. Do
not bypass checks or lower their thresholds.

Use English Conventional Commits. Release notes are maintained in
[the changelog](docs/changelog.md); publication setup is described in
[the release guide](docs/guides/releases.md).

## Repository examples and documentation

Run a [small TSX application](examples/README.md) with `npm run example` and the
selected mode. These commands are for a source checkout; package consumers follow
[Get started](docs/getting-started.md) in their existing React application.

`npm run docs:check` builds the owned TypeScript Markdown generator and its complete
reacd application. Markdown supplies content; closed TSX supplies the entire site.
It validates navigation, links, anchors, examples and syntax tokens. Serve
that generated output with the same static host used by browser conformance:

```sh
npm run preview -- --config vite.site.config.ts --port 8000 --strictPort
```

Build documentation before invoking `npm run test:browser` independently. The complete
`npm run check` command performs those steps in order and never deploys the site.

After a push to `main`, the release workflow runs that check once. Its documentation job
passes the checked `docs-<commit>` artifact to the reusable Pages workflow. Pages
publishes the checked static reacd site to the configured `reacd.dev`
domain. Pull requests do not deploy. Pages write and OIDC permissions belong only to the
deployment job; npm publication uses its existing separate path.

## Pinned SDK declarations

The source checkout applies hash-guarded declaration corrections during `npm ci`.
MUI 9.5.0's transition easing declaration conflicts with its derived types under exact
optional-property checking. React Aria Components 1.22.1 has conflicting inherited
properties in Group and OverlayArrow. Redux Toolkit 2.13.0, used by Recharts, has
exact-optional conflicts in its thunk and serialized-error declarations. Its correction
is verified with strict ESM/CJS compilation and rejected circular thunk configurations.
Corrections change only pinned declaration files. Unexpected versions, hashes or file
types fail installation; repeated installation is safe. SDK JavaScript is unchanged.
See [the upstream MUI strict optional typing issue][mui-types].

Keep strict checks and `skipLibCheck: false`. Published packages have no install script
and keep adapter declarations vendor-opaque. Clean consumer acceptance checks the
unpatched dependency installation.

[mui-types]: https://github.com/mui/material-ui/issues/28745
