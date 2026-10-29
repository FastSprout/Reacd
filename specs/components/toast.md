# Toast

Status: Agent A implementation contract; root acceptance is pending.

TOAST-001: Toast is a closed declarative TSX component with its own schema-derived
ToastProps. It requires title, controlled open and onOpenChange. Optional description,
intent, priority, named duration, closeLabel, action and closeOnAction are logical data.
No native events, HTML/CSS, positions, manager objects or timeout numbers are public.

TOAST-002: A private Base UI Toast provider and one viewport belong to each shadcn
Surface. Component registrations use stable identifiers and remain isolated across
application/SSR providers. The stack has named visible and total registration budgets.
Cards inherit the declaring component's scoped template and direction. Logical end is
resolved per card so RTL and LTR declarations can share a viewport without overlap.

TOAST-003: Normal and long durations map to named millisecond policies. An action uses
persistent duration by default; other messages use normal duration. Explicit persistent
notifications do not auto-dismiss. Hover, focus and document visibility pause native
timers. Unrelated parent rerenders preserve elapsed duration; only actual timing-policy
or lifecycle changes restart the clock. Closing/unmounting cleans up timers and prevents
stale host callbacks.

TOAST-004: Close callbacks receive only false, action callbacks receive no arguments.
They are synchronous boolean|void. False vetoes a change. Invalid returns and thrown
actions fail closed with visible feedback. Native close attempts are reconciled before
paint with controlled host state; a host keeping open=true retains the notification. A
rejected native dismissal becomes persistent until the host closes the notification.
Action acceptance closes by default, overridable by closeOnAction.

TOAST-005: Base UI provides polite/urgent announcement, F6 viewport access,
Escape and swipe gestures. The engine preserves the prior/next connected focus target
when host state closes a focused notification, including after React commit restoration.
A newer explicit host focus choice must remain untouched. The engine owns viewport
containment, word wrapping and
scrolling. No motion is required; reduced motion must retain all functionality.

TOAST-TRANSPORT-001: Version 0.2 binds open to writable boolean state and uses
registered action identifiers. Failed state writes keep the notification visible with
feedback. Handlers are checked as own callable properties at activation. No new state
kind or manager SDK enters public props or transport data.

Acceptance includes consumer types, strict schema bounds, independent provider stores,
SSR/hydration, action success/veto/errors, native callback argument isolation, timer
cleanup and pausing, controlled close rejection, announcement/focus, queue containment,
real keyboard/pointer/touch use, both templates, narrow widths, RTL and reduced motion.
Every owned executable file requires 100% statements, branches, functions and lines.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/toast.md
- https://base-ui.com/react/components/toast
- https://ui.shadcn.com/docs/components/base/toast

The adapter uses installed Base UI 1.9.0 with shadcn controls. The declarative API hides
Base UI's imperative registration model and preserves controlled application state.

Gesture containment: the text area is excluded from native swipe handling so long
messages remain touch-scrollable. A visible engine-owned grip retains native dismissal
with a full control-target height and the existing named dismiss-button alternative.
