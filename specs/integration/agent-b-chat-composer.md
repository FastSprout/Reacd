# Agent B chat composer integration

Status: implemented and focused-verified in Agent B. Root acceptance remains separate.
Requirements: CHAT-COMPOSER-001..010. Scope: ChatPrompt, ChatPromptSubmit, ChatPalette.
No new dependency or state kind belongs to this batch. Subsequent Editor work is not
included, even though its coordinated dependencies are installed in the live snapshot.

## Proposed aggregate additions

Public root/component barrels re-export each corresponding module and named Props from:

- components/chat-prompt/index.ts
- components/chat-prompt-submit/index.ts
- components/chat-palette/index.ts

Add those names and Props to the component catalog/name list. Spread chatComposerEntries
from adapter/shadcn/registry/chat-composer.ts into shadcn registry. Spread
CHAT_COMPOSER_EXAMPLES from `adapter/shadcn/__tests__/chat-composer-examples.tsx` into
the exhaustive conformance fixture. All nine AI Chat fixtures are grouped by the new
`adapter/shadcn/__tests__/chat-catalog-examples.tsx` helper to keep the aggregate below
300 lines.

Spread chatComposerVariables() from renderer/theme/chat-composer-variables.ts into
templateVariables. Import renderer/styles/chat-composer.css and form-boundary.css. The
form stylesheet may already be integrated by the Form worker.

Generative registration:

- Add chatPromptSubmitNodeSchema from schema/chat-prompt-submit to leafNodeSchemas.
- Import ChatPromptNode and ChatPaletteNode into the recursive union directly as
  ChatPromptNode<GenerativeNode> and ChatPaletteNode<GenerativeNode>.
- Add chatPromptNodeSchema(generativeNodeSchema) and
  chatPaletteNodeSchema(generativeNodeSchema) to recursive schema registration.
- visitGenerativeNodes must traverse ChatPrompt.footer and ChatPalette.prompt.
  ChatPalette.children is covered by the existing generic children traversal.
- For Prompt/PromptSubmit delegate catalogBindings to chatComposerBindings and
  nodeActionReferences to chatComposerActionReferences, both from
  schema/chat-prompt/composer-contracts.ts. Palette has no actions/bindings itself.
- Route all three nodes to ChatComposerNodeView from
  state/generative-ui/chat-composer-node-view.tsx, passing node/registry/actions and
  renderChild. This helper accepts generic Child to avoid central recursive imports.

The native boundary exports TrustedFormBoundary({ children: ReactNode }) from
renderer/form/form-boundary.tsx and FormScopeContext boolean from form-scope.tsx.
Existing FormSurface integration belongs to the Form worker, not this delivery.

## Public behavior

ChatPrompt controls draft text with string-only edit/send callbacks. Its optional
attachment metadata uses unique ids, safe URLs, statuses and per-file removable flags.
Only ready prompts with content or ready attachments send. Uploading/error attachments,
read-only/disabled/inactive scopes and busy statuses protect the send gate. IME never
submits; newline/Enter policies are explicit. No send clears the draft automatically.

ChatPromptSubmit inherits the nearest scope or uses explicit standalone capabilities.
Status/action overrides inside a scope produce diagnostics. Missing stop/retry actions
are labelled disabled controls. Public zero-argument callbacks never receive events.

ChatPalette composes normal-flow transcript and prompt tracks. Its named extent is
reserved before the first message and capped by viewport height, so a new long response
does not push the focused composer off-screen. It has no independent modal/focus trap.

Generative draft/status references are validated against declared text state. Status is
read-only and restricted to request statuses. Every submit/stop/retry/close/removal key
and recursive slot action is validated before mounting. Mixed removable/read-only
attachments do not create dead controls. State and SSR stores remain isolated.

## Source delivery

Exact owned new paths and SHA-256 hashes are recorded in
`.cache/batches/chat-composer/manifest.json`, with frozen copies below its files folder.
No existing component-owned source file was changed. The separate chat-events delta
still applies to the earlier six components; do not replace its evidence or old freezes.

The fourteen aggregate integrations listed in the manifest were performed only during
the parent's exclusive integration window. Merge those changes deliberately; do not
replace later shared files wholesale. Public docs/examples/demo use reacd TSX only.
MkDocs navigation and DataExamples already mount the three references and live examples.

## Verification

- Acceptance was added before new schemas/adapters/helpers. Initial missing-module
  failures are recorded in `.cache/chat-composer-*-before.log` and the prompt/schema
  before logs. Native portal propagation already had the required guard; its new exact
  regression verifies one inner callback and no semantically enclosing form callback.
- Final scoped run: 40 tests across 22 files pass in 17.47 seconds, recorded in
  `.cache/chat-composer-coverage-final.log`. Every one of 31 owned executable files has
  100% statements, branches, functions and lines. Nine type-only/barrel files contain no
  executable counters. Global thresholds/exclusions were not changed; unrelated files
  remain outside this focused execution and therefore do not imply a full-suite pass.
- Production, root consumers, demo and docs/examples TypeScript 7 projects pass through
  `npm run typecheck`: `.cache/chat-composer-all-types-final.log`.
- Explicit no-ignore typed lint of 1510 maintained TS/TSX paths passes:
  `.cache/chat-composer-all-lint-final.log`. This includes cross-module React Compiler
  checks; unnecessary manual focus memoization was removed without suppression.
- Strict MkDocs build passes using the root's existing Python environment with the B
  configuration and B site output: `.cache/chat-composer-mkdocs.log`. B has no separate
  docs virtual environment. The log's unlisted Form page belongs to concurrent work.
- Final official production Chromium run: all 12 Chat Composer cases pass in the
  combined 24-case run (22.3 seconds) at `.cache/input-form-chat-final-browser.log`.
  Build evidence: `.cache/input-form-chat-final-build.log`. Both templates cover
  240/360/768/1440 widths, 200% text size, RTL, real Modal focus/return, transcript
  growth, non-overlap, newline/status/file actions and composition completion.
  Final built screenshots were manually inspected at
  `.cache/chat-composer-final-1440.png` and `.cache/chat-composer-final-240.png`.

The first browser attempt found an overbroad log-text assertion, corrected to the named
transcript's exact content node. The next run exposed the real reserved-layout defect;
the specification and CSS were corrected before the final passing production run.
No timeout was raised and no failed case was excluded.

All owned files obey 300 lines, 88 columns and two-space indentation. The final whole
policy attempt reports only concurrent Form-boundary/ColorMode paths outside this batch:
`.cache/chat-composer-policy-final.log`. Generated freeze manifests and coverage/browser
artifacts retain their tool-required formats and are not maintained source.

Antislop verification uses the established technical catalog direction, ENERGY 1,
RHYTHM 2 and MOTION 1. Hard gate, purpose gate, liveliness and craftsmanship checks pass
for these scoped previews: labelled functional controls, visible focus, honest local
simulation, both templates, responsive/zoom/RTL containment, no new marketing assets or
unjustified decoration. Shared adapter and full root acceptance remain the coordinator's
responsibility; schema validation is not browser-rendering proof.
