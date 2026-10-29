# Agent B chat transcript integration

Date: 2026-10-29. Scope: ChatAttachment, ChatMessage and ChatMessages.

Status: implemented and focused-verified in the Agent B snapshot. Root acceptance,
complete catalog verification and the enterprise goal remain separate.

## Contract

Requirements: CHAT-001 through CHAT-008 in specs/components/chat-transcript.md. Each
component has a separate named Props module, schema, TSX declaration and trusted shadcn
adapter. There are no new dependencies or shared state kinds.

Public exports are ChatAttachment/ChatAttachmentProps, ChatMessage/ChatMessageProps and
ChatMessages/ChatMessagesProps from their component index.ts modules.

Schema exports are chatAttachmentSchema, chatMessageSchema and chatMessagesSchema. Their
respective generative.schema.ts files export chatAttachmentNodeSchema,
chatMessageNodeSchema and chatMessagesNodeSchema.

Generative views use literal DTOs. Actions use removeAction, actions[].action,
retryAction and nested messages[].actions[].action. The host must register every key.
ChatNodeView resolves own registered handlers with the isolated state registry. No File,
SDK, HTML, Markdown parser, network client or mutable global store is added.

## New owned files

All paths are relative to .cache/workspaces/fork-b. No existing root file was modified
by this worker. Parent-owned aggregate additions are listed separately.

```text
demo/catalog/chat-examples.tsx
demo/e2e/chat-transcript.spec.ts
docs/components/chat-attachment.md
docs/components/chat-message.md
docs/components/chat-messages.md
docs/examples/chat-attachment.test.tsx
docs/examples/chat-attachment.tsx
docs/examples/chat-message.test.tsx
docs/examples/chat-message.tsx
docs/examples/chat-messages.test.tsx
docs/examples/chat-messages.tsx
specs/components/chat-transcript.md
specs/integration/agent-b-chat.md
src/adapter/shadcn/__tests__/chat-examples.tsx
src/adapter/shadcn/chat-attachment/chat-attachment.adapter.tsx
src/adapter/shadcn/chat-attachment/chat-attachment.test.tsx
src/adapter/shadcn/chat-message/chat-message.adapter.tsx
src/adapter/shadcn/chat-message/chat-message.test.tsx
src/adapter/shadcn/chat-messages/chat-messages.adapter.tsx
src/adapter/shadcn/chat-messages/chat-messages.test.tsx
src/adapter/shadcn/chat-messages/use-follow-latest.test.ts
src/adapter/shadcn/chat-messages/use-follow-latest.ts
src/adapter/shadcn/registry/chat.ts
src/components/chat-attachment/chat-attachment.props.ts
src/components/chat-attachment/chat-attachment.tsx
src/components/chat-attachment/chat-attachment.types.test.ts
src/components/chat-attachment/index.ts
src/components/chat-message/chat-message.props.ts
src/components/chat-message/chat-message.tsx
src/components/chat-message/chat-message.types.test.ts
src/components/chat-message/index.ts
src/components/chat-messages/chat-messages.props.ts
src/components/chat-messages/chat-messages.tsx
src/components/chat-messages/chat-messages.types.test.ts
src/components/chat-messages/index.ts
src/core/chat-policy.ts
src/renderer/styles/chat.css
src/renderer/theme/chat-variables.ts
src/schema/chat-attachment/chat-attachment.schema.ts
src/schema/chat-attachment/chat-attachment.test.ts
src/schema/chat-attachment/generative.schema.ts
src/schema/chat-attachment/index.ts
src/schema/chat-message/chat-message.schema.ts
src/schema/chat-message/chat-message.test.ts
src/schema/chat-message/generative.schema.ts
src/schema/chat-message/index.ts
src/schema/chat-messages/action-references.ts
src/schema/chat-messages/chat-messages.schema.ts
src/schema/chat-messages/chat-messages.test.ts
src/schema/chat-messages/generative.schema.ts
src/schema/chat-messages/index.ts
src/schema/chat-messages/portable.test.ts
src/state/generative-ui/chat-hydration.test.tsx
src/state/generative-ui/chat-node-view.test.tsx
src/state/generative-ui/chat-node-view.tsx
src/state/generative-ui/chat-transport.test.tsx
```

## Proposed aggregate additions

Parent B has merged these into its working snapshot; Agent A still merges root:

- Add the three public exports, ComponentCatalog props and COMPONENT_NAMES.
- Spread chatEntries from adapter/shadcn/registry/chat.ts into shadcnAdapter.
- Add CHAT_EXAMPLES to the exhaustive adapter fixture.
- Import renderer/styles/chat.css and spread chatVariables() into theme variables.
- Add all three leaf node schemas to the generative leaf registry.
- Delegate their action references to chatNodeActionReferences(node).
- Route all three node types to ChatNodeView({node, registry, actions}).
- Mount ChatExamples in the Content and data demo family.
- Add the three public reference pages to MkDocs navigation.
- Regenerate transport schemas and compiled examples centrally.

No shared value binding or registry kind is proposed in this readonly transcript batch.
Network streaming updates come through typed host props or replaced validated transport
documents, with host application state owned by Jotai.

## Verification evidence

- .cache/chat-schema-before.log records missing-module acceptance before code.
- .cache/chat-readability-before.log records a real 360px metadata-width regression.
- .cache/chat-coverage.log: 24 tests across 16 files passed; 22 owned executable files
  have 100% statements, branches, functions and lines. Nine empty/type-only files are
  recorded separately. Global thresholds/includes are unchanged, so this scoped command
  exits nonzero for unrelated unexercised runtime modules.
- .cache/chat-transport.log: two additional complete GenerativeUI transport tests pass,
  including nested registered callbacks and unregistered-action rejection.
- .cache/chat-lint.log: scoped type-aware oxlint passes without warnings.
- .cache/chat-types-final.log records the latest four-project typecheck result.
- .cache/chat-browser-frozen.log: twelve Chromium scenarios pass in 32.1 seconds. They
  cover both templates, 240/360/768/1440px, 200% text, actual scoped RTL, readable
  metadata width, no overflow, touch targets, image decode/failure, keyboard removal,
  action protection, scrolling suspension/resumption and retry.
- The frozen browser source path is in .cache/chat-browser-snapshot.txt. Isolated port
  5193 was stopped automatically. A previous live-source browser failure was caused by
  concurrent HMR resetting the catalog family, so final evidence uses a frozen source
  copy rather than increasing timeouts or enabling retries.

Manual Compact 375px visual review found a thin attachment metadata column despite
passing overflow checks. CHAT-008 and its failing browser assertion preceded the fix: a
named metadata track and full-row removal action. Reviewed before/after images:
.cache/chat-attachment-mobile.png and .cache/chat-attachment-mobile-after.png. The final
metadata remains readable; the transcript screenshot .cache/chat-mobile-compact.png also
retains scoped RTL and full long text.

## Delivery gate

### Follow-up: complete-source ref analysis

The combined checkpoint found a react(refs) diagnostic that the original scoped
invocation missed: reading an event function through the mixed ref/hook-result
object. ChatMessages now destructures viewport, latest, scroll and showLatest;
the ref is only assigned to ref and event functions run only as event handlers.
No suppression or lint rule changed. .cache/chat-all-source-lint.log records
explicit maintained-source analysis with no ChatMessages diagnostic (concurrent
temporal work still had separate errors). .cache/chat-refs-fix-tests.log records
eight passing focused regression tests across five files. The frozen adapter and
manifest were refreshed; only that adapter and this ledger changed in the batch.

Established direction: technical component catalog, ENERGY 1 / RHYTHM 2 / MOTION 1. The
previews expose real controls and labelled example data, with no generated assets,
promotional claims or unrelated sections. Typography/colors inherit validated tokens.

- Uploading/failure switches show explicit accessible status feedback.
- Protected removal cannot fire; keyboard removal requests host change.
- Broken images retain visible filenames; replacement URLs can load again.
- Streaming/failure states retain partial text; complete state clears busy feedback.
- Message actions and retry dispatch explicit host callbacks.
- Reading history suspends following; keyboard jump resumes only transcript scroll.
- Isolated stores preserve independent attachment state; SSR/hydration keeps labels.
- Public documentation describes literal transport adaptation and omitted SDK/HTML
  features. It does not claim that schema validation proves geometry correctness.

All maintained owned files are checked for 300 lines, 88 columns and two-space/no-tab
formatting. No coverage threshold, runtime include or ignore path was changed.
