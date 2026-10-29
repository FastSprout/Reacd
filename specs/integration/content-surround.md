# ContentSurround integration

Status: verified isolated Agent A batch, pending combined acceptance.
Workspace: .cache/workspaces/a-content. No root or fork-a production edits were made.

The frozen files are limited to this component's owned paths. Shared files in this
snapshot predate newer parent integrations and must never replace parent aggregates.

## Integration

- Add ContentSurround/ContentSurroundProps to catalog, names and exports.
- Register contentSurroundSchema with ShadcnContentSurround in the shadcn content map.
- Import renderer/styles/content-surround.css. No new theme variables are required.
- Register contentSurroundNodeSchema as a generative leaf. NodeView maps its properties
  directly to ContentSurround; no new binding, visitor slot or action is introduced.
- Add the exhaustive example, mount ContentSurroundExample in NavigationExamples and
  add its MkDocs reference. Add an explicit packed TSX fixture.
- Regenerate the combined schemas/examples, then run all local gates.

The native links have stable names separate from optional descriptions. They preserve
modified-click behavior, document order, real keyboard navigation and safe new windows.
Missing data creates no invented link, including while the example title is empty.

## Verification

- Initial acceptance failed before schema/facade/adapter modules existed.
- Seven focused tests in five files passed. Six executable files have 100% statements,
  branches, functions and lines: 16 statements, 24 branches, four functions, 15 lines.
  Type-only/barrel modules are separate empty files, not excluded runtime.
- Strict four-project types, typed lint, source policy and strict MkDocs passed.
- Production library/demo build and packed external consumer passed.
- Sixteen production Chromium scenarios passed: both templates, four widths, real
  scoped RTL and 200% text. Checks cover long unbroken text, empty/recovered neighbors,
  declaration focus order, measured containment, null-opener new-window links and a
  main-frame native navigation event from keyboard Enter.
- Logs: .cache/content-{coverage,types,lint,policy,build,package,docs,browser}.log.
- No dependency, state kind, network service or publication was introduced.

The specification and example explain the adaptation from Nuxt Content's implicit
database lookup to explicit host-provided document relationships. Combined integration
does not prove every browser or full enterprise completion.
