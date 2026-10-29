# Composed chat loading announcements

Status: scoped correction gates passed; complete composed acceptance remains pending.

## Provenance and requirements

This isolated copy starts from the immutable 3,310-path final-review-source checkpoint.
Every source hash was checked before copying. The independent Standards review found
ChatPrompt, ChatMessage and ChatAttachment statuses inside busy ancestors. Its Shimmer
question identified a conflict between CHAT-FEEDBACK-002 and RENDER-014.

Chat transcript/composer/feedback requirements were updated before acceptance tests. The
resolved feedback contract keeps changing details busy while the trigger's Shimmer
status remains outside that subtree. The status never marks itself busy. Stable trigger
names and the existing finite decoration remain unchanged.

## Red-first behavior and correction

Seven original DOM regressions failed before runtime changes. They prove standalone
upload/message/prompt busy ancestors, Shimmer self-busy, Reasoning/Tool nesting and
nested transcript statuses. The final scope includes these cases plus independent footer
portal behavior. No claim of assistive-technology speech output is inferred from DOM.

The correction marks actual changing content busy:

- Message text retains the streaming flag; article identity and author naming remain.
- Attachment filename, metadata and image preview retain uploading flags.
- Prompt draft/attachment fields occupy a private busy content wrapper. Its pending
  status and footer controls remain outside that wrapper, within the same native form.
- Reasoning and Tool disclosure details carry the active busy state. Triggers keep their
  explicit stable accessible names and their unchanged active-label decoration.

A private renderer context covers only closed message DTOs within a transcript log and
attachment DTOs within busy prompt fields. Redundant nested loading labels remain
visible as ordinary text while the existing outer transcript/prompt status announces
progress. Independent sibling messages, footer statuses and footer portal messages keep
live semantics. Ready logs restore independent nested statuses. Error alerts, host
values/actions, send/stop/retry gates and existing portal/focus behavior are unchanged.

No public Props, schema, state kind, registry or package dependency changed. CSS changes
only introduce the private prompt content track and move existing label/textarea rules
onto it; the same design tokens and native form remain in use.

## Verification

- 68 unit/component/transport/example tests pass across 38 files. All eight changed
  executable files retain 100% statements, branches, functions and lines, respectively
  37/90/20/37 measured paths. No coverage threshold or exclusion changed.
- Official build and unchanged bundle budgets pass; largest JavaScript chunk is 450,028
  bytes. All four strict TypeScript projects, affected typed lint, full source policy,
  schema/example freshness, packed consumer/SSR/export checks and strict MkDocs pass.
- Ten fresh production Chromium cases pass with one worker and zero retries. Both
  templates at 240px, scoped RTL and 200% text exercise composer/transcript/feedback
  reflow. Composed transport cases assert all seven rendered statuses have no busy
  ancestor, nested labels remain visible, busy content/log flags persist, footer status
  stays live, stop actions execute and drafts remain unchanged. Existing cases retain
  native Enter/newline, stop/retry/file behavior, Modal focus/visibility, escaped text,
  minimum targets and readable attachment metadata.

Intermediate failures are retained: one initial test used an unavailable custom DOM
matcher; another selected both the Tool section and its legitimate detail region. Tests
now use the existing role/name query and the trigger's actual aria-controls target.
Strict types required HTMLElement narrowing for a closest ancestor and the raw
GenerativeDeclaration fixture type before JSON validation. Three long imports and one
test title were wrapped to satisfy the unchanged 88-character source rule. No
assertions, callbacks, timeouts, tolerances or coverage requirements were weakened.

The complete integrated source must still run its final acceptance gates. Original root
and fork-a source remain untouched by this correction worker; all work stays local.
