# Chat explicit-jump focus correction

Status: verified isolated correction; combined B/A acceptance remains separate.
Workspace: .cache/workspaces/b-chat-focus. No live B, fork-a or root source was edited.

The snapshot started from immutable controls-transcript/checkpoint. Its maintained
tooling/build source is retained; generated build output, dependencies and caches were
excluded. node_modules links to B's independent installed dependencies. No install,
dependency update, commit, push, publication or deployment was performed.

## Requirement and implementation

CHAT-004 now distinguishes passive following from explicit user navigation. Passive
updates preserve the reader's outside focus and history position. Keyboard or pointer
activation of Jump to latest message focuses the existing focusable log with
preventScroll:true after moving to the latest content. It does not mutate readonly
message DTOs or block navigation while busy feedback is present.

Only one runtime file changes: adapter/shadcn/chat-messages/use-follow-latest.ts.
The private follow() function performs the existing transcript-only scroll. The layout
effect calls follow() without focus. The existing latest() activation boundary calls
follow() and focuses its returned element. Missing viewport refs remain safe.
The adapter, public props, state, central registry and dependencies do not change.

Baseline SHA-256 for src/adapter/shadcn/chat-messages/use-follow-latest.ts:
6570faba8038e8d1d69a165625988e79536b14d832b4657f801de81b54487b14

This equals both frozen delivery 02 and the inspected live B file before work and at
freeze. The patch therefore composes with B's separate zero-argument retry wrapper.
Do not replace chat-messages.adapter.tsx from this older snapshot during integration.

## Acceptance and verification

- Red acceptance preceded runtime edits: keyboard and pointer jumps both removed their
  focused button and failed the log-focus assertion. Passive/SSR cases passed.
- Green scope: 9 tests in 4 files, covering existing scroll behavior and hydration plus
  new explicit keyboard/pointer focus, preventScroll arguments, frozen readonly data,
  streaming/submitted busy state, passive new-message updates, history suspension,
  followLatest:false and SSR without native focus calls.
- The changed runtime file has 100% statements, branches, functions and lines:
  20 statements, 12 branches, 5 functions, 17 lines. No coverage path or threshold was
  changed. Command and JSON reports remain with the frozen evidence.
- Four strict TS7 projects, explicit type-aware lint, maintained-file policy and
  production library/demo build passed. No public declaration changed.
- Two production Chromium cases passed without retries on isolated port 5199, both
  templates at 320 pixels, scoped RTL and 200% text. Each exercises keyboard and pointer
  jumps, focus/scroll geometry, busy state and passive appends with outside focus.
  Suspended history and disabled following are checked too.
- Document scroll assertions allow only the browser's unavoidable maximum-scroll clamp
  after removing the final control; focus causes no extra document scroll. The unit
  boundary asserts the exact preventScroll:true call.
- The test-owned preview server stopped after completion.

## Minimal integration

Freeze: .cache/batches/chat-focus/ with exact hashes, baseline hashes, files/,
diffs/ and evidence/. Import the one runtime patch and new colocated/browser tests;
merge the CHAT-004 wording and this ledger. No aggregate proposals are needed.
Previous B callback fixes and private form/portal changes remain independently owned.

This correction does not accept the full B catalog or replace combined acceptance.
