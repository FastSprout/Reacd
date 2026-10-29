# Agent B delivery: InputTags and Tree

Date: 2026-10-29. Status: frozen and independently verified in Agent B's snapshot.
Root integration and catalog acceptance remain Agent A owned. No root production file
was edited and no remote operation was performed.

## Frozen sources

Batch: `.cache/workspaces/fork-b/.cache/batches/tags-tree/`.

- `files/`: exact changed source files, frozen before date/chat work.
- `changes.json`: new versus modified paths with SHA-256 hashes.
- `new-paths.txt` and `modified-paths.txt`: separate path lists.
- `aggregate.patch`: reviewable changes against the fresh fork baseline.
- `checkpoint/`: the complete frozen source used for verification.
- `evidence/`: command logs and coverage summary.

Never copy the whole snapshot over Agent A's source. Merge aggregate changes after
review. The supplied `playwright.config.ts` change is B's operational port 4176;
preserve A's port configuration. Regenerate schema artifacts after combined integration.

## Export and integration contract

InputTags: `InputTags`, `InputTagsProps` from components/input-tags/index.ts;
`inputTagsSchema`, `tagsValueSchema`, `inputTagsNodeSchema` from schema/input-tags.
Adapter: `ShadcnInputTags`. Binding: `BoundInputTags`, selection kind with explicit
read/readWrite access, read mode forces readOnly. No new dependency or state kind.

Tree: `Tree`, `TreeProps` from components/tree/index.ts; `treeSchema`,
`treeItemsSchema`, `treeItemSchema`, `treeValueSchema`, `treeExpandedSchema`,
`treeNodeSchema` from schema/tree/index.ts. Adapter: `ShadcnTree`. `BoundTree` binds
selection and expansion independently to selection-kind state. Read mode protects the
corresponding transition. No dependency or state kind is added.

Merge both public catalog names/types and exports; fieldEntries/feedbackEntries; two
leaf schemas and binding contracts; two NodeView cases; CSS imports; exhaustive adapter
fixtures; compiled examples in Fields and Content/data; MkDocs component navigation.
All exact edits appear in aggregate.patch. No other family's source is included.

## Review corrections

TREE-007 preflight now reserves collection size before reading elements and rejects
array-only nesting. New regressions first reproduced both failures, including an
oversized array whose first getter throws. Cycle, shared identity, depth and total
node limits remain enforced without recursively parsing hostile input first.

Visual review found a selected-row foreground typo, `on-primary` versus the template's
`onPrimary`. The browser assertion first failed in both templates, then passed after
correction. Disabled-row browser attempts now use an actual pointer position instead
of waiting for Playwright's disabled-element actionability check.

Explicit lint found InputTags modifying a ref returned from a hook and passing an
unbound method. A private composition setter keeps mutation inside the hook, and arrow
callbacks preserve the receiver-independent contract. Draft rejection and IME tests
cover the correction.

## Verification evidence

The frozen source passed policy, strict types, typed lint, schema freshness, compiled
example freshness, production build and package/consumer checks. The full unit run
passed 887 tests in 236 files. All 480 executable production files measured 100%:

- Statements: 2969 / 2969.
- Branches: 2026 / 2026.
- Functions: 853 / 853.
- Lines: 2737 / 2737.

The 156 empty/type-only files contain no executable coverage totals. Coverage includes,
exclusions and thresholds were unchanged. The complete Chromium run passed 264 tests,
including 28 new tag/tree scenarios. Narrow widths, both profiles, 200% text, computed
RTL, native validity, paste, keyboard navigation, selected contrast and protection were
exercised. These checks do not establish universal browser correctness.

The frozen full check ran outside the ancestor .gitignore so default oxlint could
discover files. Its final MkDocs stage reported only the theme git mixin's missing
repository metadata. The identical frozen docs then passed strict MkDocs from the
checkpoint inside the repository. No git metadata was fabricated or modified. Logs
record both outcomes. Explicit `--no-ignore` typed lint also passed in the checkpoint;
running plain oxlint under an ignored .cache directory is not lint evidence.

Primary requirements: TAGS-001 onward in components/input-tags.md and TREE-001 through
TREE-007 in components/tree.md. Source references and adaptation limits are retained
in those specs and public component pages. The inventory stays Required until A's
combined acceptance.
