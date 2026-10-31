# Contributing

Use Node.js 26+, TypeScript 7 and two-space indentation. Keep maintained files within
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
npx playwright install chromium
python3.13 -m venv .venv-docs
.venv-docs/bin/python -m pip install -r requirements-docs.txt
npm run check
```

The complete check includes layer rules, strict types, lint, fixture/schema freshness,
per-file coverage, builds, installed-package acceptance, MkDocs and browser conformance.
Keep 100% statement, branch, function and line coverage for every owned runtime file. Do
not bypass checks or lower their thresholds.

Use English Conventional Commits. Release notes are maintained in
[the changelog](docs/changelog.md); publication setup is described in
[the release guide](docs/guides/releases.md).

## Repository examples and documentation

Run a [small TSX application](examples/README.md) with `npm run example` and the
selected mode. These commands are for a source checkout; package consumers follow
[Get started](docs/getting-started.md) in their existing React application.

`npm run docs:check` compiles live examples and builds the strict MkDocs site. Serve
that generated output with the same static host used by browser conformance:

```sh
npm run preview -- --config vite.site.config.ts --port 8000 --strictPort
```

Build documentation before invoking `npm run test:browser` independently. The complete
`npm run check` command performs those steps in order and never deploys the site.
