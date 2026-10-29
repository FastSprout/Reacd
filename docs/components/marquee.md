---
template: preview.html
reacd_preview: Marquee
reacd_preview_height: 560
---

# Marquee

Marquee displays bounded text notices with an explicit pause control and a complete
readable alternative. Moving content never contains interactive controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/marquee.tsx"
```

Require label, items, paused and onPausedChange. Items are readonly `{id, label}` text
objects, with unique ids and at most twenty entries. Optional pace is slow, normal or
fast, default normal. Optional direction is forward or backward, default forward;
direction follows App RTL. Optional emptyMessage replaces the empty-state text.

Pause/Resume request controlled host updates. Hover or focus temporarily pauses motion
regardless of host intent; leave the region to resume enabled motion. Read all notices
opens the original content using native keyboard-operable disclosure. Visual copies are
hidden from accessibility, inert and contain no focusable descendants.

ReadOnly and reduced-motion preference force a visible static list without dead motion
controls. Unknown preferences, including the server snapshot, also show static content
with explanatory text. Hydration observes the client preference without claiming the
server knows a user's motion settings. No ambient clock or global application store is
used. Labels wrap, full content remains available and the page never widens.

Generative 0.2 binds paused to boolean state with read/readWrite access. Read bindings
force readonly static content. App and SSR stores remain isolated. Links, arbitrary
children, styling, durations and animation callbacks are outside the closed contract.
