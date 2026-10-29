# Editorial page delivery

Workspace: .cache/workspaces/layout. Frozen source and exact new/modified SHA-256
manifest: .cache/batches/editorial-pages/. Earlier presentation/navigation frozen
batches remain unchanged. Scope: BlogPost, BlogPosts, ChangelogVersion,
ChangelogVersions. No new dependency or state kind is introduced.

Requirements: specs/components/editorial-pages.md (EDITORIAL-001 through 006).

## Closed contracts

Single entries accept optional title/description, canonical calendar date/dateLabel,
validated src/alt image DTO, orientation, surface variant, safe header/badge/authors/
children/footer/actions slots, safe href/newWindow or a named title callback. A title
action requires a title. Date labels require a valid date. Collections accept optional
keyed entry arrays and safe children; duplicate keys are rejected and host order remains
unchanged. Children supplement the structured entries.

BlogPosts defaults to horizontal intrinsic grid; vertical is supported. Changelog
collections provide an inherited optional indicator default, overridable per entry.
Indicators are static decoration and never the sole representation of content.

Dates render the explicit display label or canonical ISO string, with no ambient clock,
timezone or Intl output. Images reserve core-owned geometry, contain rather than crop,
show an honest accessible failure fallback, and reset failure when source identity
changes. The docs' missing image is clearly labeled as a failure-state placeholder. All
author/example records are explicitly illustrative, not fabricated release claims.

## Integration

1. Merge four component catalog/exports and editorialEntries registry additions.
2. Import renderer/styles/editorial.css and spread editorialVariables() into template
   variables. Entry/collection adapters and each strict schema remain separate modules.
3. Add BlogPostNode, BlogPostsNode, ChangelogVersionNode and ChangelogVersionsNode
   directly to the recursive GenerativeNode type, then editorialNodeSchemas() to its
   runtime discriminated union. Recursive generic union aliases must remain direct.
4. Visitor: every single-entry slot; synthesize each keyed posts/versions item as an
   entry node so its own action and all nested slot references are checked. Ordinary
   collection children use the existing traversal. Entries require children arrays.
5. nodeActionReferences includes optional BlogPost/ChangelogVersion action names.
6. Dispatch all four types to EditorialNodeView with renderChild/registry/actions.
   Guarded Object.hasOwn action resolution prevents inherited callback execution,
   including if an accepted host action is removed after rendering.
7. Mount EditorialExamples outside SplitView and merge four MkDocs references and
   compiled examples. Conformance fixtures include all four named components.

The parent has since split document.schema.ts into runtime factories, generative-node.ts
and visit-nodes.ts. This snapshot intentionally retains the older aggregate shape. Map
the explicit type/factory/visitor additions to those parent-owned files instead of
copying the snapshot aggregate. Current snapshot counts: document.schema 289 lines,
node-view 296 lines. Further aggregate growth requires the parent's refactor.

Do not overwrite root scoped RTL, captured Pagination URLs, form bridges or inherited
action hardening from other deliveries.

## Verified snapshot evidence

- Schema red acceptance failed before the new modules existed.
- 20 passing scoped unit/consumer/example/SSR/hydration tests in 14 files.
- All 31 owned executable files have 100% statements, branches, functions and lines;
  eight type-only/barrel files are empty. Covered totals: 86 statements, 53 branches, 36
  functions and 84 lines.
- Report: .cache/coverage/editorial/coverage-summary.json.
- Strict types, source policy, actual lint, production build, packed-package consumer
  and strict MkDocs passed. Logs: .cache/editorial-{types,policy,lint,build,package,
  docs}.log.
- Sixteen production Chromium scenarios passed: both templates, four widths
  (240/320/768/1440), scoped LTR/RTL, 200% text, native lazy-image failure fallback,
  independent article/version actions, indicator changes, keyboard focus order,
  containment and retained draft values through appearance changes.
- Additional Compact 320px RTL visual rerun passed and its screenshot was inspected:
  .cache/editorial-Compact-320-rtl.png. Wrapped headings, error content and controls
  remain visible and separate. Browser log: .cache/editorial-browser.log.
- Lazy image tests scroll the media into view before waiting for native loading. No
  eager-loading workaround or application DOM mutation was added.

Combined root coverage, generated-schema freshness and all browser regressions remain
the integrating agent's acceptance gate. This batch alone does not complete enterprise
scope or prove correctness across all browsers.
