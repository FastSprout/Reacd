# Agent B Editor example naming overlay

Date: 2026-10-29. Source: fork-b. Parent requested a naming-only source-policy
correction after the lookup foundation freeze. No public API or runtime behavior
changes.

Rename local document/setDocument to value/setValue in EditorExample and
EditorToolbarExample. The existing documentAtom names, document data, labels, callbacks,
Jotai hook order and controlled behavior remain unchanged. Align the public Editor
page's code snippet with the same supported naming. This avoids the application source
policy's reserved browser-global identifier while retaining domain documentation
terminology.

All three baseline hashes match the immutable editor-docs-integration freeze. Neither
that artifact nor the earlier editor-generative freeze was rewritten. This batch
contains only the three modified paths plus this new internal record; no aggregates,
native adapters, controllers, packages or build outputs are included.

Two real native example tests pass in .cache/editor-value-names-tests.log. Typed
no-ignore lint passes with zero diagnostics for both examples in
.cache/editor-value-names-lint.json. The actual inspectRepository source/application
policy returns no issues for all three paths in .cache/editor-value-names-policy.json.
Strict noEmit application TS7 passes in .cache/editor-value-names-types.log using
editor-value-names-tsconfig.json in .cache; it inherits the examples' closed reacd JSX
configuration and full strict/exact compiler settings.

The earlier 100% example behavior coverage remains applicable to this identifier-only
overlay; parent reruns combined coverage after integration. Maintained files satisfy 300
lines, 88 columns and two spaces. Generated cache artifacts retain formats. Work remains
local without commits, remote writes, publication, deployment or DNS changes.
