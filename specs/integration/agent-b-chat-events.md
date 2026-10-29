# Chat event-boundary follow-up

Date: 2026-10-29. Requirements: CHAT-EVENT-001 through CHAT-EVENT-003.

This is a component-owned delta over the frozen transcript and feedback batches.
Original frozen files and proof remain unchanged. No aggregate or dependency changes are
needed. Four trusted adapters now invoke zero-argument public capabilities explicitly,
preserving the existing callback types and UI behavior.

## New files

```text
specs/components/chat-event-boundary.md
specs/integration/agent-b-chat-events.md
```

## Modified owned files

```text
src/adapter/shadcn/chat-attachment/chat-attachment.adapter.tsx
src/adapter/shadcn/chat-message/chat-message.adapter.tsx
src/adapter/shadcn/chat-messages/chat-messages.adapter.tsx
src/adapter/shadcn/chat-tool/chat-tool.adapter.tsx
src/adapter/shadcn/chat-attachment/chat-attachment.test.tsx
src/adapter/shadcn/chat-message/chat-message.test.tsx
src/adapter/shadcn/chat-messages/chat-messages.test.tsx
src/adapter/shadcn/chat-tool/chat-tool.test.tsx
src/adapter/shadcn/chat-reasoning/chat-reasoning.test.tsx
```

## Verification

.cache/chat-events-before.log records four genuine failures: keyboard removal, message
actions, transcript retry and tool decisions received a SyntheticEvent argument despite
their zero-argument contract. Correct Vitest exact-call matchers were used. After the
wrappers, all ten focused assertions pass in .cache/chat-events-after.log. Disabled
controls still cannot fire.

The callback audit also verifies the Base UI boolean boundary: ChatDisclosure calls
onOpenChange(value) explicitly, so SDK event details are not forwarded. Exact
one-boolean assertions pass for both Reasoning and Tool. Internal scroll handlers
receive native events only inside the trusted adapter and expose none to applications.

.cache/chat-events-coverage.log: 54 tests in 36 files pass for the first six chat
components. All 47 owned executable files retain 100% statements, branches, functions
and lines. Eighteen empty/type-only files remain separate. Includes and thresholds are
unchanged; unrelated unexercised files make scoped coverage exit nonzero, not an owned
coverage failure.

The production TypeScript build passes. Full-project type/lint attempts are recorded in
.cache/chat-events-types-final.log and .cache/chat-events-all-lint.log; concurrent
Chart/FormField/Switch/Textarea work had incomplete public exports/consumer types. No
chat-owned diagnostic appeared. Parent combined verification remains authoritative. All
delta files obey the maintained-source line/width/indentation policy.

The previous production browser reports cover unchanged layout and semantics. Parent
should overlay these exact owned files onto checkpoint 3 and rerun the appropriate
combined checks. This follow-up does not claim to complete the composer batch or the
enterprise catalog.
