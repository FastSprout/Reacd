# Content outline delivery

Workspace: .cache/workspaces/a-content. Scope: ContentNavigation and ContentToc.
Requirements: OUTLINE-001 through OUTLINE-005. No dependency, state kind or public
provider change is introduced. Earlier ContentSurround/Search freezes remain immutable.

## Closed contracts

ContentNavigation owns a semantic hierarchical link list and controlled branch
expansion. Its separate disclosure buttons never hijack native link behavior.
Current state is explicit; ordinary activation can be vetoed before navigating.
ContentToc maps semantic keys to real fragment destinations, without DOM queries or
scrollspy claims. Nested disabled state, read-only expansion and empty states remain
visible and accessible.

Untrusted recursive data first passes the existing boundedTree preflight. TREE_POLICY
owns depth, node count and indentation constraints. Shared semantic identifiers, safe
href validation, globally unique keys, valid current keys and unique branch-only
expansion state apply before rendering or shared state writes.

Both generative nodes require a currentKey text reference. Navigation additionally
requires an expandedKeys selection reference. Read and readWrite modes are explicit.
Refused writes preserve state and prevent navigation; recovery clears visible errors.
The shared private native link boundary captures href before a synchronous callback,
passes only its key, preserves modifier/new-window behavior and rejects invalid returns.

## Integration

The frozen manifest separates new component-owned files, baseline-hashed shared
DisplayNodeView modifications and aggregate proposals. Merge proposals deliberately.

- Register two modules/Props and named schema-derived public TSX functions.
- Spread contentOutlineEntries into the shadcn registry and import content-outline.css.
- Register both leaf node schemas. Their item trees contain no executable callbacks,
  generative child UI or registered actions, so no extra visitor/action dispatch exists.
- Merge current/expansion binding constraints into catalogBindings.
- Dispatch ContentNavigation/ContentToc through BoundContentNavigation/BoundContentToc;
  this snapshot uses DisplayNodeView to keep the main dispatcher below 300 lines.
- Merge exhaustive conformance fixtures, compiled examples, NavigationExamples mounts,
  two MkDocs links, public catalog prose and packed consumer declarations/assertions.
- Regenerate portable JSON schemas. Preserve the parent's CompositionCatalog and
  dispatcher partitions, newer source policies, native callback guards and Modal fixes.

## Verification

- Initial schema acceptance failed before modules existed: .cache/outline-red.log.
- 28 focused tests passed across 10 files, including schema/consumer types, native
  links, controlled rendering, state refusal/recovery/constraints and SSR/hydration.
- All 18 executable owned files measured 100% in all four metrics: 139 statements,
  114 branches, 47 functions and 126 lines. Six type-only/barrel files are empty.
  Reports: .cache/outline-complete-coverage/{coverage-summary.json,coverage-final.json};
  exact command: .cache/outline-complete-command.json. No runtime paths were excluded.
- 18 production Chromium cases passed: both templates, four widths from 240 to 1440,
  scoped LTR/RTL, 200% text, native link/new-window/fragment behavior, keyboard focus,
  veto/recovery, disabled/read-only/empty state and native protected popup handling.
- Two of those cases render 16 levels through the public generative editor at 240px,
  RTL and 200% text. Deepest native link bounds remain within the navigation, and both
  tree/ToC links move focus to the real heading. Page-level overflow remains absent.
  Log: .cache/outline-browser.log. These are actual layout checks, not schema claims.
- The Compact 320px RTL visual rerun passed and its screenshot was inspected:
  .cache/content-outline-compact-rtl.png. Labels wrap and controls remain separate.
  Log: .cache/outline-visual.log.
- Strict types, actual typed lint, source policy, schema generation, production build,
  packed consumer and strict MkDocs passed. Logs: .cache/outline-{types,lint,policy,
  schema-generate,build,package,docs}.log.

Integrated full coverage and all browser regressions remain the parent's acceptance
gate. This delivery does not independently mark inventory entries Verified or complete
enterprise scope. Root production source remains unchanged.
