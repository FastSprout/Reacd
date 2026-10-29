# Packed package acceptance

PACKAGE-001: Build and pack locally with lifecycle scripts disabled. Extract the archive
into an isolated consumer directory outside the repository. Consumers must resolve
package exports and emitted declarations, without source aliases.

PACKAGE-002: Compile a strict TypeScript 7 TSX consumer with the reacd JSX runtime.
Exercise named component Props, the theme adapter, Jotai stores, generative state, and
the DataTable controller. Compiler safety options match the source project.

PACKAGE-003: Independent negative fixtures must fail compilation for native JSX, styling
properties, incorrect controlled value types, and private package imports. Each fixture
must fail for its intended diagnostic, not a missing dependency.

PACKAGE-004: Execute the compiled positive consumer in Node. Verify React SSR, typed
state transitions, readonly display bindings, and two isolated stores. Resolve every
public export, including both portable schemas and compiled CSS. Private implementation
paths must remain blocked by package exports at runtime.

PACKAGE-005: The persistent local check runs package acceptance after building.
Temporary consumers and archives are removed after success or failure. Packing is local
verification only; no package publication or registry operation is allowed.

PACKAGE-007: Report success only after temporary-workspace cleanup succeeds. If removal
fails, propagate the error without printing an acceptance-success message.

PACKAGE-006: Production builds clear generated library output before compilation.
Archives must not contain tests, fixtures, internal specs, or stale modules from earlier
builds. Declaration maps and source maps require their referenced source files to be
shipped; otherwise maps are disabled.
