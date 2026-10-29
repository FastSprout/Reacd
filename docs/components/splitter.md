---
template: preview.html
reacd_preview: Splitter
reacd_preview_height: 560
---

# Splitter

Splitter divides a named workspace into uniquely identified panels. Applications supply
percentage shares and constraints, while the adapter owns handles, sizing and reflow.

## Runnable example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/splitter.tsx"
```

The local fixture supports keyboard and pointer resizing, collapse/restore, vertical
layout, scoped RTL direction and disabled interaction. Its Jotai values survive reflow
and template changes.

## Contract

| Property      | Meaning                                                       |
| ------------- | ------------------------------------------------------------- |
| label         | Required accessible group name                                |
| panels        | Two through eight uniquely keyed panels, in declaration order |
| value         | Controlled readonly array of id/share records totaling 100    |
| onValueChange | Required callback receiving a complete candidate layout       |
| orientation   | horizontal or vertical, default horizontal                    |
| disabled      | Stops keyboard and pointer resizing                           |

Each panel has id, label and safe content. minShare and maxShare use named engine
defaults of 10 and 90 when omitted. An optional collapsedShare must be below minShare.
Layouts must match panel order and constraints. NaN, duplicate IDs, missing panels and
invalid totals are rejected before rendering. Rejected host changes do not fabricate
local uncontrolled values.

Handles expose separator semantics, adjacent panel IDs and current bounds. Arrow keys
resize the adjacent pair by one share; Shift uses ten. Home and End move to bounds.
Horizontal arrows follow scoped RTL direction. Enter collapses the primary panel when
configured and restores its last expanded share. Other panels retain their shares.

Pointer cancellation, lost capture and focus loss restore the starting layout.
Completion keeps the latest accepted value. Capture is released on completion,
cancellation and unmount. Narrow horizontal groups reflow into document order; controls
remain reachable. Vertical workspaces use an engine-owned extent and scroll individual
panels as needed.

Generative UI uses the explicit panelLayout state kind with a readWrite binding. Initial
and live layouts are checked against the same panel constraints. Persistence is a host
state concern; the renderer never reads storage or the ambient clock during SSR.

The shadcn adapter follows its resizable composition and APG semantics using a private
percentage engine. It does not expose react-resizable-panels APIs, native handle props,
CSS sizing, low-level DOM callbacks or automatic localStorage behavior.
