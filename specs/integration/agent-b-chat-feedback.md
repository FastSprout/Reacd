# Agent B chat feedback integration

Date: 2026-10-29. Scope: ChatReasoning, ChatTool and ChatShimmer. Status: implemented
and focused-verified in Agent B; root acceptance remains separate.

## Contract and public API

Requirements: CHAT-FEEDBACK-001 through CHAT-FEEDBACK-007 in
specs/components/chat-feedback.md. Public exports are the three component names and
corresponding named Props types from their separate component index.ts modules. Schema
exports are chatReasoningSchema, chatToolSchema and chatShimmerSchema. Their
generative.schema.ts files export the corresponding camelCase NodeSchema. No dependency
or shared state kind is added.

Reasoning is controlled. Automatic stream-edge open/close requests default false and
respect manual overrides, host rejection, disabled state and StrictMode replay. Tool
approval can be read-only, or provide a complete explicit approve/reject pair. Retry is
only available in error state. No output string executes as HTML or code.

Shimmer foreground remains constant. Only an absolute decorative underline pulses with
named finite iteration/opacity policy. A valid custom template can have opposite
foreground luminances against gray, so foreground interpolation is deliberately
forbidden. Reduced motion disables decoration animation without removing text.

## New owned paths

All paths below are relative to .cache/workspaces/fork-b. Existing aggregate files were
changed only by the parent coordinator, not this worker.

```text
demo/catalog/chat-feedback-examples.tsx
demo/e2e/chat-feedback.spec.ts
docs/components/chat-reasoning.md
docs/components/chat-shimmer.md
docs/components/chat-tool.md
docs/examples/chat-reasoning.test.tsx
docs/examples/chat-reasoning.tsx
docs/examples/chat-shimmer.test.tsx
docs/examples/chat-shimmer.tsx
docs/examples/chat-tool.test.tsx
docs/examples/chat-tool.tsx
specs/components/chat-feedback.md
specs/integration/agent-b-chat-feedback.md
src/adapter/shadcn/__tests__/chat-feedback-examples.tsx
src/adapter/shadcn/chat-disclosure/chat-disclosure.tsx
src/adapter/shadcn/chat-reasoning/chat-reasoning.adapter.tsx
src/adapter/shadcn/chat-reasoning/chat-reasoning.test.tsx
src/adapter/shadcn/chat-reasoning/use-reasoning-disclosure.test.tsx
src/adapter/shadcn/chat-reasoning/use-reasoning-disclosure.ts
src/adapter/shadcn/chat-shimmer/chat-shimmer.adapter.tsx
src/adapter/shadcn/chat-shimmer/chat-shimmer.test.tsx
src/adapter/shadcn/chat-tool/chat-tool.adapter.tsx
src/adapter/shadcn/chat-tool/chat-tool.test.tsx
src/adapter/shadcn/registry/chat-feedback.ts
src/components/chat-reasoning/chat-reasoning.props.ts
src/components/chat-reasoning/chat-reasoning.tsx
src/components/chat-reasoning/chat-reasoning.types.test.ts
src/components/chat-reasoning/index.ts
src/components/chat-shimmer/chat-shimmer.props.ts
src/components/chat-shimmer/chat-shimmer.tsx
src/components/chat-shimmer/chat-shimmer.types.test.ts
src/components/chat-shimmer/index.ts
src/components/chat-tool/chat-tool.props.ts
src/components/chat-tool/chat-tool.tsx
src/components/chat-tool/chat-tool.types.test.ts
src/components/chat-tool/index.ts
src/core/chat-feedback-policy.ts
src/renderer/styles/chat-feedback.css
src/renderer/theme/chat-feedback-variables.ts
src/schema/chat-reasoning/chat-reasoning.schema.ts
src/schema/chat-reasoning/chat-reasoning.test.ts
src/schema/chat-reasoning/generative.schema.ts
src/schema/chat-reasoning/index.ts
src/schema/chat-shimmer/chat-shimmer.schema.ts
src/schema/chat-shimmer/chat-shimmer.test.ts
src/schema/chat-shimmer/contrast.test.ts
src/schema/chat-shimmer/generative.schema.ts
src/schema/chat-shimmer/index.ts
src/schema/chat-tool/chat-tool.schema.ts
src/schema/chat-tool/chat-tool.test.ts
src/schema/chat-tool/feedback-contracts.ts
src/schema/chat-tool/generative.schema.ts
src/schema/chat-tool/index.ts
src/schema/chat-tool/portable.test.ts
src/state/generative-ui/bound-chat-reasoning.tsx
src/state/generative-ui/bound-chat-tool.tsx
src/state/generative-ui/chat-feedback-actions.test.tsx
src/state/generative-ui/chat-feedback-hydration.test.tsx
src/state/generative-ui/chat-feedback-node-view.tsx
src/state/generative-ui/chat-feedback-state.test.tsx
src/state/generative-ui/chat-feedback-transport.test.tsx
test-support/chat-contrast.ts
```

## Aggregate additions for Agent A

Parent B has already integrated these in its snapshot:

- Add component catalog entries, names and separate public exports.
- Spread chatFeedbackEntries from the new shadcn registry module.
- Spread CHAT_FEEDBACK_EXAMPLES into the exhaustive adapter fixture.
- Import chat-feedback.css; spread chatFeedbackVariables() into template variables.
- Add all three NodeSchema leaf entries.
- Delegate binding/action references to chatFeedbackBindings and
  chatFeedbackActionReferences from schema/chat-tool/feedback-contracts.ts.
- Route nodes through ChatFeedbackNodeView; the parent uses AdditionalNodeView to keep
  the existing central renderer within source size limits.
- Mount ChatFeedbackExamples in the Content and data family.
- Add three component reference pages to MkDocs navigation.
- Regenerate transport schemas/examples centrally.

Open is a declared boolean read/readWrite reference. Read mode protects disclosure and
suppresses auto writes. Reasoning text and Shimmer text/active accept explicit read
projections with text/boolean constraints. Tool data remains literal transport;
registered approval/rejection/retry keys are validated before exposing controls.

## Verification

- .cache/chat-feedback-before.log: missing-module acceptance before implementation.
- .cache/chat-feedback-coverage.log: 28 tests across 19 files pass. All 25 owned
  executable files measure 100% statements, branches, functions and lines. Nine
  empty/type-only files are separate. Global thresholds/includes remain unchanged, so
  scoped coverage exits nonzero for unrelated unexercised runtime files.
- .cache/chat-feedback-types-final.log: all four strict TypeScript projects pass.
- .cache/chat-feedback-all-lint.log: explicit maintained-source, type-aware lint passes
  without warnings or suppressed rules. Paths were enumerated because this working
  snapshot lives under an ignored .cache directory.
- All maintained owned files obey 300 lines, 88 columns and two-space/no-tab policy.
- .cache/chat-feedback-contrast.log proves the regression fixture is a valid theme whose
  valid text/muted endpoints cannot be safely interpolated.

Browser draft: demo/e2e/chat-feedback.spec.ts, thirteen cases. Parent production preview
runs verify both templates, 240/360/768/1440px, 200% text, actual scoped RTL, scrollable
details, touch targets, keyboard control, opt-in auto policy, approval/ rejection/retry
protection, finite/reduced motion and the adversarial Theme override.

The earlier full run passed eleven cases and exposed a real Chromium name defect: a
nested busy live region erased the disclosure button name. The engine now assigns an
explicit stable aria-label and aria-busy to the trigger; the exact-name locator was
preserved. A later unrelated DataTable Pending label caused a strict selector collision,
fixed by scoping the same status assertion to its named preview region. The two
production interaction cases now pass in .cache/b-feedback-interactions-fixed.log.
Parent is rerunning the complete thirteen cases for a final common report; root
acceptance is not claimed by this ledger.

## Delivery gate

Established technical catalog direction remains ENERGY 1 / RHYTHM 2 / MOTION 1. Examples
identify simulated summaries/tool outputs and trigger real controlled state changes. No
generated assets, testimonials, provider claims or network tool execution are
introduced. Foreground contrast and fixed text geometry survive the valid
opposite-luminance theme regression. Public docs describe literal transport limits.

Unit/SSR checks cover isolated state, read/write constraints, unregistered action
rejection and stable hydration. Browser evidence remains distinct from schema proof.
This batch does not modify the previously frozen transcript batch or complete the
remaining ChatPrompt, ChatPromptSubmit and ChatPalette work.
