---
template: preview.html
reacd_preview: Alert
reacd_preview_height: 560
---

# Alert

Alert presents a bounded message with explicit severity, optional host actions and
controlled dismissal.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/alert.tsx"
```

Require title, message and intent: info, success, warning or error. Optional icon uses
the closed semantic Icon vocabulary. Text is escaped and wraps automatically.

Optional open controls visibility and defaults to visible. Supply onOpenChange with
explicit open to enable dismissal; a missing callback means readonly visibility and no
close button. Dismissal requests false; the host decides whether to apply it. Optional
closeLabel replaces the default Dismiss plus title label and requires a dismissal
callback.

Optional actions contain at most four unique `{id, label, onPress, intent?, disabled?}`
entries. Every action uses a native keyboard-operable button. Informational/success
messages use status semantics; warnings/errors use alert semantics. Focus remains
visible, text wraps and controls retain minimum touch targets in both templates.

Generative 0.2 uses literal visibility or a boolean state reference with read/readWrite
access. Readonly bindings render no dismissal action. Action keys must be registered by
the host. Unknown properties, duplicate action ids, unsafe callbacks and styling escapes
are rejected.
