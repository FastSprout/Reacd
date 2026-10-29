# Demo module loading and bundle acceptance

BUNDLE-001: Keep the synchronous public library API and SSR behavior unchanged.
The demo lazily imports each catalog family and the generative playground using
literal, build-resolvable imports declared outside render functions. Shared runtime
dependencies may use named vendor chunks. Do not raise or disable Vite's size warning.

BUNDLE-002: Preserve the workspace shell, navigation and appearance control while a
view is loading. Show a named reacd loading placeholder. Isolate render/load errors
to the affected view, with a clear message and an actual reload link warning that
reload clears unsaved local changes. Changing views resets that error boundary.
Do not automatically reload or pretend a cached rejected lazy import can retry.

BUNDLE-003: Keep the existing application Jotai store above all lazy boundaries.
Switching families or workspace tabs preserves host-owned field values, generative
source and registry values. Module loading must not replace the provider/store.

BUNDLE-004: Generate Vite's production manifest. A persistent build gate checks every
JavaScript asset against a named 500,000-byte uncompressed limit. Reject malformed
manifests, missing assets/import targets, unsafe output paths, invalid byte sizes,
unlisted JavaScript assets, missing entry points and missing deferred view entries.

BUNDLE-005: Walk static and complete import graphs separately. Every required lazy
view must be a reachable dynamic entry and absent from the static entry closure.
Report raw initial-static bytes, total JavaScript bytes, largest chunk and file count.
These are artifact measurements, not network-transfer, startup-time or FPS claims.

BUNDLE-006: Check the actual production request graph in Chromium. Unvisited families
and playground chunks must not load on initial Layout render. A held module request
shows the loading state while controls remain usable. Loaded modules are reused,
business values survive navigation, and a failed request leaves other views usable.
An explicit reload recovers from a once-failed module request.

BUNDLE-007: Require focused success/failure unit tests, full per-file coverage of new
runtime/tooling/CLI modules, strict typing, source policy, packed SSR acceptance,
the full browser suite and strict MkDocs. The bundle gate runs after production
output is created and fails the build on violations.

BUNDLE-008: Temporal dependencies use semantic vendor groups for React Aria/Stately
and the calendar/internationalization SDKs. Preserve the synchronous public API,
SSR markup, existing deferred family boundaries and the 500,000-byte per-chunk limit
when those pinned packages are integrated.

BUNDLE-009: Ordinary production output includes both index.html and the trusted
/temporal-recovery.html browser conformance entry. The latter bootstraps the
existing trusted test-support fixture. It must not rely on a separate private
Vite root or weaken the full browser suite, application authoring restrictions,
lazy catalog boundaries, manifest validation or fixed asset budgets. Keep all
fixture assets visible to the existing manifest/size inspection.

BUNDLE-010: Preserve the ordinary index and temporal recovery HTML inputs while
adding the maintained /listbox-field-metadata.html conformance entry. Its trusted
native harness remains test scaffolding. Keep every emitted JavaScript asset in
the normal manifest/graph/budget inspection; add no private build dependency or
coverage/source-policy escape. Both original metadata browser cases remain live.

BUNDLE-011: Registered native Editor uses separate semantic TipTap and ProseMirror
vendor groups, including orderedmap, rope-sequence and w3c-keyname with the latter.
Keep all ordinary HTML entries, existing React Aria/temporal groups, deferred module
boundaries and unchanged 500000-byte per-chunk limits. Include every emitted asset
in the same manifest and budget inspection.

BUNDLE-011: The Editor field-metadata conformance route is another ordinary MPA
input. Preserve the catalog, temporal and Listbox entries and all SDK vendor
intent when adding it. Trusted public-TSX/Jotai proof scaffolding belongs under
test-support; no component API, sizing token, budget or coverage rule is altered.

References retrieved 2026-10-29:

- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/Suspense
- https://vite.dev/guide/backend-integration.html
- https://rolldown.rs/in-depth/manual-code-splitting

BUNDLE-013: Embedded documentation previews compile through vite.docs.config.ts into
.cache/docs-preview-dist with relative assets. They reuse the ordinary vendor groups
and actual public TSX examples. This separate entry does not replace or alter ordinary
workbench/conformance entries. The documentation gate copies generated preview assets
into site/assets/previews after strict MkDocs generation and validates each reference.
The preview retains the existing maximum chunk byte budget. A semantic adapter chunk
separates trusted adapter code from the preview host. The gate rejects empty or
oversized JavaScript output without increasing limits or suppressing warnings.
