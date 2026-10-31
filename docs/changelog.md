# Changelog

## [0.3.0] - Unreleased

### Added

- Separate `@fastsprout/reacd-mui` adapter for the complete component catalog.
- Material UI controls and surfaces with independent browser styles and SSR.
- Live documentation switches for adapters, compact templates and RTL.
- Shared behavior acceptance for both adapters and three-package release checks.

### Changed

- Use Node.js 22 for development and CI, with a minimum version of 22.12.0.
- Give design-independent adapter behavior one source owner and colocated tests.
- Wait for npm processing within a bounded window while checking exact archive bytes.

### Fixed

- Propagate nested templates and application direction into Material UI themes.
- Preserve isolated Jotai state across adapter changes.

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
