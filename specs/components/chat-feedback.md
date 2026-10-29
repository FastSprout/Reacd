# Chat feedback components

Status: specified. Scope: ChatReasoning, ChatTool and ChatShimmer.

CHAT-FEEDBACK-001: ChatShimmer presents required nonempty plain text with optional
active status. Foreground text remains constant. A named, finite decorative underline
pulses independently. Never interpolate foregrounds: valid templates may use opposite
foreground luminances against a mid-gray surface. Never animate text opacity, erase
text, change geometry or hide overflow. Reduced-motion preferences disable motion.
Inactive content is ordinary text rather than a live loading region. Active text uses a
polite status without aria-busy on itself. Its decoration does not constitute a changing
content subtree and must not defer its own announcement.

CHAT-FEEDBACK-002: ChatReasoning displays a labelled controlled disclosure with required
bounded text, open and onOpenChange. Streaming, disabled, autoOpen and autoClose are
explicit logical options; all default false. The trigger announces expanded state and
retains an explicit stable accessible name. Streaming marks the changing detail panel
busy; its Shimmer progress status stays outside that busy subtree and never marks itself
busy. Detail text is escaped and wraps. Empty text shows the named empty summary label.
The component displays host-provided summaries and never infers private model reasoning.

CHAT-FEEDBACK-003: Optional autoOpen requests true once when a stream begins, and
autoClose requests false once when it ends. These are host callbacks, never hidden
application state. A manual toggle during a stream suppresses its automatic close. The
override resets for the next stream cycle. StrictMode effect replay and rejected host
requests must not emit duplicate transitions. Disabled/read bindings cannot request
automatic or manual writes. No clock, timer or SSR-dependent default exists.

CHAT-FEEDBACK-004: ChatTool has required label, status, open and onOpenChange. Status is
pending/running/approval/success/error. Input/output/error are optional bounded plain
text. Details remain controlled and scroll within a named block limit. Missing details
display a named empty state. Status is always textual and never color-only. The
component never executes code, tools, commands, URLs or model output.

CHAT-FEEDBACK-005: Approval can be read-only with no actions. Interactive approval
requires both onApprove and onReject; either alone is invalid. Approval actions are
valid only in approval status. An optional onRetry action is valid only in error status.
Disabled controls cannot fire. Rejected host actions preserve supplied status/output.
Public callbacks receive no DOM events. Keyboard disclosure and approval/retry controls
must remain reachable, labelled and safe at narrow widths.

CHAT-FEEDBACK-006: Separate Props/schema/TSX/adapter modules implement all entries.
shadcn composition owns native rendering. Generative open uses an explicit boolean state
reference with read or readWrite access. Read mode renders disabled disclosure and
suppresses auto policies. Reasoning text and Shimmer text/active may reference read-only
text/boolean keys. Tool approval/retry use registered action keys that are validated
before rendering. Literal tool data updates through validated document replacement; no
expression evaluator or implicit action execution is introduced.

CHAT-FEEDBACK-007: Acceptance includes closed types, schema limits and paired actions,
all statuses, empty/long/escaped details, controlled host acceptance/rejection,
keyboard/pointer interaction, disabled/read-only protection, strict effect replay, state
isolation/constraints, action validation and SSR/hydration. Require 100% in all four
coverage metrics for every runtime file, compiled examples and real browser tests of
both templates, 200% text, actual RTL, motion and readable reflow.

References: cached Nuxt UI primary documents in .cache/references for chat-reasoning,
chat-tool and chat-shimmer, retrieved 2026-10-29.

React adaptation: automatic disclosure transitions are opt-in controlled requests, not
Nuxt's internal default state/timer. Semantic tool statuses and explicit actions replace
arbitrary slots, SDK objects and render functions. Shimmer uses decorative underline
motion rather than foreground interpolation or transparent text. No private reasoning,
streaming, tool execution or Markdown renderer is part of this contract.
