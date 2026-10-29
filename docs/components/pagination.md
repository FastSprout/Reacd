---
template: preview.html
reacd_preview: Pagination
reacd_preview_height: 560
---

# Pagination

Pagination selects a page in a bounded dataset. It shares the pagination value shape
used by DataTable, with a zero-based `pageIndex` and a positive `pageSize`. Displayed
page numbers and generated URLs are one-based.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/pagination.tsx"
```

## Properties

- `label`: accessible navigation name.
- `totalItems`: nonnegative safe integer; an empty dataset has one empty page.
- `value`: controlled `{ pageIndex, pageSize }`, within the current dataset.
- `onValueChange`: optional callback receiving the complete next value. Returning
  `false` rejects URL navigation; a void return accepts it.
- `navigation`: optional `{ href, pageParameter?, pageSizeParameter? }`.
- `showControls`, `showEdges`: true by default.
- `siblingCount`: zero, one or two; defaults to two.
- `size`: `small`, `medium` or `large`; defaults to medium.
- `disabled`: disables navigation and value changes.

The navigation decision is synchronous. Run asynchronous data loading in the application
state or router rather than returning a promise from this callback.

Without a callback or URL descriptor, the component is read-only. Page controls remain
bounded even for a billion-item dataset. Changing datasets or page sizes is an
application state transition; update the value and count together.

## Native URL navigation

The URL example targets an application-owned `/orders` route. Supply a real host route
before using it. The engine preserves existing query parameters and hash, and adds
`page` and `pageSize` unless distinct parameter names are supplied. Unsafe URLs,
oversized generated URLs and invalid parameter names are rejected.

With both a URL and callback, an ordinary click updates controlled state and follows the
URL captured at activation. A synchronous update cannot change that destination before
navigation starts. Modified clicks retain native browser behavior without changing the
current tab's state.

## Accessibility and generative state

The current numbered page has `aria-current="page"`. Boundary controls are disabled. A
status announces the selected page and total page count. Controls wrap in constrained
containers, with native keyboard activation and focus.

Generative version `0.2` binds `value` to a `pagination` state key using `read` or
`readWrite`. A read binding disables mutation and links. Mounted controls constrain
shared state to their dataset bounds; rejected transitions retain the old page.
