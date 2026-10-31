# Changelog

## [0.3.0](https://github.com/FastSprout/Reacd/compare/v0.2.0...v0.3.0) (2026-10-31)


### ⚠ BREAKING CHANGES

* separate the engine and complete shadcn adapter packages

### Features

* enforce layer direction and dependency cycles ([dfec20b](https://github.com/FastSprout/Reacd/commit/dfec20bcae0cf3db7d4b3131aa95162418354de0))
* implement closed TSX UI framework and complete shadcn catalog ([5a2ff6b](https://github.com/FastSprout/Reacd/commit/5a2ff6b6e752e84f5ccd80010e90e88584b0671c))
* separate the engine and complete shadcn adapter packages ([e432e28](https://github.com/FastSprout/Reacd/commit/e432e284b8a1c9d0c9a1c65f47cf7aa0c57c1af6))


### Bug Fixes

* publish the scoped package with closed browser bootstrap ([5889060](https://github.com/FastSprout/Reacd/commit/58890605c35c9308891905d3e262e0fa77af9c65))
* recover editor queries and publish native edits before hydration ([3154156](https://github.com/FastSprout/Reacd/commit/3154156d8c0b3ea6ee5aa1733ccc4ba99b4093d7))

## [0.2.0] - 2026-10-31

### Changed

- Separate the headless engine from the shadcn/ui adapter package.
- Require explicit adapter selection at the application composition root.
- Move design-system dependencies and browser styles into the adapter package.
- Reserve the adapter runtime exports for trusted integration code.

### Added

- Installed-package acceptance for the engine and adapter as separate archives.
- Internal ownership rules in addition to the existing layer and cycle checks.
- A public security reporting policy.

### Fixed

- Share one npm-first README between GitHub and the published package.
- Keep repository example commands and development dependencies out of the consumer
  package metadata.
- Compile and verify the documented React installation against the installed package,
  including its browser styles and isolated application state.
- Verify existing archive bytes before retrying a partial package publication.
- Recover editor suggestions after query replacement and preserve native edits while
  controlled document updates are being published.

## [0.1.0] - 2026-10-30

### Added

- TSX authoring through 150 closed React components for layouts, forms, data, navigation
  and content.
- A complete shadcn/ui adapter with spacious and compact design templates.
- Adaptive layout and text-overflow policies owned by the rendering engine.
- Jotai stores isolated per application and server-rendering request.
- Optional generative JSON transport with typed state bindings and atomic table
  transitions.
- Runnable counter, form and dashboard applications with a shared browser host.
- A browser-only bootstrap entry point and separately exported compiled styles.
- MkDocs component documentation with 150 compiled interactive previews.
- Mandatory architecture linting for layer direction, import aliases, re-exports and
  dependency cycles.
- Strict TypeScript 7 checks, colocated tests, per-file coverage requirements,
  production browser conformance and installed-package acceptance.
- Documentation build artifacts, Conventional Commit release notes and a gated npm
  trusted-publishing workflow.

### Package

- Package identifier: `@fastsprout/reacd`.
- Node.js 26 or newer.
- Tested host peers: React 19.3.1, ReactDOM 19.3.1 and Jotai 3.0.1.
- Apache-2.0, with the upstream shadcn MIT notice included in distributions.

[0.1.0]: https://www.npmjs.com/package/@fastsprout/reacd/v/0.1.0
[0.2.0]: https://github.com/FastSprout/Reacd/releases/tag/v0.2.0
