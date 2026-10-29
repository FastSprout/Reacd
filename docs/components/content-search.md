---
template: preview.html
reacd_preview: ContentSearch
reacd_preview_height: 560
---

# ContentSearch

ContentSearch combines a controlled search dialog and the closed CommandPalette. The
host supplies groups and handles data loading; no CMS or router is assumed.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/content-search.tsx"
```

## Properties

Required properties are `title`, `label`, `open`, `onOpenChange`, `query`,
`onQueryChange` and `groups`. CommandPalette filtering, status, disabled items, messages
and logical selection callbacks are supported. Optional `description`, `triggerLabel`,
`closeLabel` and safe `footer` content configure the dialog.

## Selection and accessibility

`onSelect(key)` runs before the command. Returning `false` vetoes the action and
closing. Accepted selections close by default; `closeOnSelect={false}` keeps the dialog
open. Asynchronous selection decisions are rejected with a visible diagnostic. Load
asynchronous data separately and supply its resulting state.

Query state survives dismissal. Focus enters search and returns to its opener. Escape
dismisses the dialog. CommandPalette handles keyboard navigation and IME composition.
Loading, error and empty messages distinguish unavailable results. No global shortcut is
installed implicitly.

## Generative transport

Version 0.2 uses explicit writable boolean `open` and text `query` references. Optional
text `selection` publishes an accepted key. Selection and automatic close commit
together; rejected writes preserve both values and block the command. Registered action
names replace executable callbacks. Footer feedback remains inside the dialog. These
validation rules complement browser conformance checks.
