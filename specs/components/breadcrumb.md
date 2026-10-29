# Breadcrumb

BREADCRUMB-001: Provide a separate strict schema, named Props/function, adapter and
tests. Require a navigation label and one to 32 items with unique keys and labels.
Items may have a safe href or typed onPress callback, never both, and disabled state.
Accept a named slash/chevron separator. Reject raw tags, CSS, native events, arbitrary
icons and vendor props. The last item is the current page.

BREADCRUMB-002: Render a named navigation landmark and ordered list. Ancestors can be
links, actions or plain text. Current links retain native navigation with aria-current;
plain current text also identifies the current page. Disabled targets are not active.
Separators are decorative, not additional labels or tab stops.

BREADCRUMB-003: Follow shadcn breadcrumb/list/item/link/page composition. Long labels
and deep paths wrap without clipping or hiding ancestors. Logical layout works in RTL
and at enlarged text. Link/button focus and target behavior belong to the engine.

BREADCRUMB-004: Reuse the framework's safe link contract, including rejecting script,
protocol-relative, control-character and backslash-origin URLs. Preserve native link
modifier behavior. Actions receive no browser events and invoke only their callbacks.

BREADCRUMB-005: Generative 0.2 uses action names instead of callbacks. Validate every
referenced action even for disabled/current items; unknown actions fail before render.
Use the complete TSX adapter and literal path data. No expressions or code are allowed.

BREADCRUMB-006: Require schema/type/action/failure tests, per-file 100% coverage,
portable JSON, packed consumer, stable SSR/hydration, compiled docs and browser
acceptance with both templates, eight widths, RTL, long paths and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/breadcrumb
- https://ui.shadcn.com/docs/components/base/breadcrumb

The closed contract preserves navigation/actions while replacing arbitrary render
tags, separator icons and dotted label lookups with explicit validated properties.
