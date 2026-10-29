# Agent B: remote Mention simulator

Status: owned source, scoped acceptance and compiled examples ready. Production browser
verification remains coordinated. The Editor and Forms workers own the remote menu
implementation; this batch contains its genuine public example.

## Scope and requirements

Implements LOOKUP-EXAMPLE-001 through LOOKUP-EXAMPLE-006. EditorMentionLookupExample
uses public reacd TSX and isolated Jotai state. One response atom stores the host's
delivered result. Separate request, counter and saved-response atoms expose correlation
and replay. No backend, fetch, timer, new dependency or shared state kind is involved.

The simulator displays the latest issued key/query and request count. It starts with
no request and a null response. A new native token publishes matching loading. Resolve,
Fail, Empty and Clear controls deliver explicit host response states. Save snapshots a
ready response; Replay delivers that exact DTO without inventing a fresh key.

The native engine, not the example, generates opaque scoped keys and decides whether
results match the active token. Replaying A after a valid B cannot overwrite B. A new A
after B requires a different key. The host-delivered response can therefore differ from
the menu's accepted response. Ready labels intentionally contain no test query, proving
that native remote results are authoritative rather than substring-filtered again.

The host owns document acceptance. Rejected native edits preserve the prior document;
they may briefly issue a query before rollback. Read-only and disabled protection block
further lookup interactions. Host response delivery remains independent. Insertion
returns focus asynchronously through the native editor, with no application DOM refs,
browser events, SDK instances or styling props.

## Owned integration

New public example export: EditorMentionLookupExample. New reference page:
docs/components/editor-mention-lookup.md. Browser acceptance:
demo/e2e/editor-mention-lookup.spec.ts. The coordinator mounts the example once in the
Editor group under Content and data and owns navigation and build outputs.

Public DTO types are EditorMentionLookupRequest, EditorMentionLookupResult and
EditorMentionItem, exported by the component owner. The Forms worker owns their strict
schemas and pure request controller; the Editor worker owns primary/menu/store/panel
integration. No files in those implementation areas are part of this batch.

## Scoped verification

- `.cache/editor-lookup-example-final.log`: two genuine native example tests pass.
  They exercise null/loading/error/empty/ready, unchanged counts on response updates,
  retained current results under stale props, A/B/A keys, fuzzy mention insertion,
  rejected edits, protection, restoration, SSR hydration and provider isolation.
- `.cache/editor-lookup-coverage.log`: the owned runnable example has 100% statements,
  branches, functions and lines: 42 statements, 18 branches, 11 functions and 40 lines.
  Coverage thresholds and source include/exclude settings remain unchanged. The scoped
  command reports unrelated unexercised source rather than hiding it.
- `.cache/editor-lookup-policy.log`: no owned source policy violations.
- `.cache/editor-lookup-docs.log`: strict local MkDocs build passes. Internal
  requirements and this ledger remain outside docs.
- `.cache/editor-lookup-lint-final.log`: explicit owned TypeScript paths pass
  type-aware lint without warnings against refreshed public declarations.
- `.cache/editor-lookup-docs-types.log`: runnable public examples compile with strict
  exact optional properties. Combined source/test types remain coordinator-owned.

## Acceptance details

`.cache/editor-lookup-example-before.log` records acceptance before the example module
existed. Early native runs already passed loading/error/empty and current-result
retention, but their simulated repeated Backspace did not establish the intended JSDOM
caret and produced query qrqq. Unit acceptance now uses the existing explicit DOM range
helper followed by real text replacement. This is not native layout proof; Chromium
uses actual End/Backspace input for continuous query replacement.

A later assertion wrongly required no lookup requests when the host rejects a native
edit. The document correctly rolled back, but the temporary token had already requested
results. Acceptance now checks unchanged document state and no further requests during
protection. This corrects the test contract without changing native runtime behavior.
Native focus restoration is scheduled; the unit test awaits actual focus rather than
asserting it before the editor's scheduled restoration completes. No timeout was raised.

## Boundaries and handoff

This example demonstrates local response delivery, not an HTTP client, cancellation
service, directory authentication or network loading performance. The host must manage
actual network cancellation and errors. Correlation prevents stale rendering but does
not cancel work. Existing local Mention examples and documentation remain independent.

Freeze only the new owned paths and merge shared registration additions deliberately.
Logs, screenshots, generated coverage and manifests retain required tool formats and
are excluded from maintained-source limits. No runtime source is excluded from
coverage. Final combined gates belong to the coordinator. All work remains local.

Primary references:

- https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorMentionMenu.vue
- https://tiptap.dev/docs/editor/extensions/nodes/mention
