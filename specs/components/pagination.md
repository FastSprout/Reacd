# Pagination

PAGINATION-001: Provide a separate strict schema, named Props/function, adapter and
tests. Require label, totalItems and a controlled value with pageIndex/pageSize using
the existing pagination state kind. Accept optional typed onValueChange, safe URL
navigation configuration, disabled, showControls, showEdges, bounded siblingCount and
logical size. No native tags, events, dimensions, CSS or vendor handles are public.

PAGINATION-002: State is zero-based; visible page numbers and generated URL page values
are one-based. Empty datasets have one non-actionable page. Reject invalid counts,
out-of-range pages and inconsistent configuration. Never allocate a list proportional to
totalItems: render a bounded window with meaningful non-interactive ellipses.

PAGINATION-003: Provide first/previous/next/last controls and page choices. Disable
boundary or host-disabled actions. Without a change callback or URL configuration,
display read-only controls. Native buttons support Tab/Enter/Space; current page is
marked aria-current and page changes update a polite status. Preserve pageSize.

PAGINATION-004: URL mode uses a safe base href and named page/page-size parameters.
Preserve unrelated query values and fragments. Reject unsafe or oversized generated URLs
and colliding parameter names. Native link modifier actions keep browser behavior
without mutating the originating view. Hosts own routing and controlled value changes.
With a callback, capture the activated URL before committing state, then navigate to
that exact destination. A synchronous controlled update must not change the browser
destination from page N to page N+1 during the same click. The callback may return false
to reject navigation. A rejected generative state write must veto URL navigation as well
as preserving the previous state.

PAGINATION-005: Generative 0.2 binds value to pagination state in read/readWrite mode.
Read mode disables editing, including URL controls. Validate initial/live ranges and
active host writes; shared registry constraints may reject a proposed transition and
must expose diagnostics without mutating prior state. Reuse the TSX adapter.

PAGINATION-006: Follow shadcn navigation/list/item composition with engine-owned button
or link semantics. Controls wrap within narrow containers, RTL and 200% text without
hidden labels or global overflow clipping. Size and control policies remain named.

PAGINATION-007: Require schema/type/core/window/URL tests, per-file 100% coverage,
portable JSON, packed TSX/SSR, hydration, compiled docs and full browser acceptance
across both templates, eight widths, long labels and disabled/read-only states.

RTL browser scenarios must establish an actual App direction scope and verify computed
direction. Changing an outer document attribute alone is insufficient when a parent
control defines its own writing direction.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/pagination
- https://ui.shadcn.com/docs/components/base/pagination

Nuxt's arbitrary icons/classes and route-builder callback become fixed semantic controls
and a validated URL descriptor. Application state and URL routing stay explicit rather
than introducing implicit component-owned business data.
