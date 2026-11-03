# Changelog

## [0.3.1](https://github.com/FastSprout/Reacd/compare/v0.3.0...v0.3.1) (2026-11-03)


### ⚠ BREAKING CHANGES

* **adapters:** Components and variants without a native SDK mapping now throw UnsupportedAdapterComponentError instead of using a shared fallback. See the documented adapter availability before upgrading.

### Features

* **adapters:** render with native shadcn and Material UI SDKs ([110b5a2](https://github.com/FastSprout/Reacd/commit/110b5a22248492db701225db082b57914a2f1b07))
* **docs:** generate the site with reacd and native theme controls ([afe8928](https://github.com/FastSprout/Reacd/commit/afe8928b1dd368f4c6409fb1dab18744298dd9f2))


### Bug Fixes

* Stabilize native menu and panel animation checks.

* Keep native checkbox labels inside narrow fields.
* Constrain native page navigation wrappers in both directions.

* **adapters:** preserve native field and popup behavior ([2c9febf](https://github.com/FastSprout/Reacd/commit/2c9febff9125d37fd1d989f36fabfc4523c9c421))
* **ci:** deploy checked documentation and validate native packages ([4a2ac5c](https://github.com/FastSprout/Reacd/commit/4a2ac5c62b3ef9b2cae9dffca502024d6446d057))
* **shadcn:** keep data table filter labels within their tracks ([fd644a6](https://github.com/FastSprout/Reacd/commit/fd644a660f00c160660e3eded1837da3138e3aee))


### Continuous Integration

* parallelize complete release verification ([59b95f4](https://github.com/FastSprout/Reacd/commit/59b95f43305bd6efb2c9e14eea708ab7d1c0dcfd))

## [0.3.0](https://github.com/FastSprout/Reacd/compare/v0.2.1...v0.3.0) (2026-10-31)

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

- Keep long-pressed context menus open after releasing the opening touch.

- Resolve adapter styles declarations during clean-checkout type checks.

- Propagate nested templates and application direction into Material UI themes.
- Preserve isolated Jotai state across adapter changes.

## [0.2.1](https://github.com/FastSprout/Reacd/compare/v0.2.0...v0.2.1) (2026-10-31)


### Bug Fixes

* install Chromium before packed-consumer publication checks ([9477714](https://github.com/FastSprout/Reacd/commit/94777141d521d5a220c0372a261b1cac8a969718))
* publish npm packages before completing GitHub releases ([a8e44de](https://github.com/FastSprout/Reacd/commit/a8e44de1ea1af5455f8da213767db78ca18c0bde))
* serialize normal and recovery release publication ([b7afb3f](https://github.com/FastSprout/Reacd/commit/b7afb3f08f44c0a6352ae373e92102283cfd3f92))

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
