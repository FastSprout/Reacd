# Agent A composition integration

Status: combined fork-a checks passed; parent inventory acceptance is pending.

This integration is local to .cache/workspaces/fork-a. The root checkout is unchanged.
Inventory entries are not marked Verified by this delivery. Parent owns final inventory
acceptance and the remaining enterprise scope.

## Frozen sources

- a-layout/.cache/batches/dashboard: ten Dashboard modules, 109 new paths and 14
  shared proposals. This includes two shared test-support fixtures.
- layout/.cache/batches/editorial-pages: BlogPost, BlogPosts, ChangelogVersion and
  ChangelogVersions, with per-file manifest hashes and kinds.
- a-navigation/.cache/batches/edge-panels: Drawer and Slideover, new/modified lists,
  SHA-256 hashes and reviewed aggregate patch.
- a-navigation/.cache/batches/action-menus: ContextMenu and DropdownMenu, equivalent
  manifests, hashes and shared proposals.
- layout/.cache/batches/pricing: PricingPlan, PricingPlans and PricingTable. The
  unused optional PageFamilyNodeView was omitted; the receiving dispatcher is retained.
- a-content/.cache/batches/content-surround and content-search: ContentSurround,
  ContentSearch and ContentSearchButton, including exact reviewed private corrections.

All paths above are relative to .cache/workspaces/. Every new source path was checked
against its frozen hash before import. Shared files were merged as additions instead
of whole-file replacement. Generated generative schema was rebuilt after integration.

## Shared decisions

The receiving recursive GenerativeNode and visitor remain in their separate modules.
Generic recursive interfaces are listed directly; factory registration stays in
document.schema.ts. Traversal includes Dashboard regions and every slot, editorial
entry collections, ContextMenu children and edge-panel footers.

The central generative renderer delegates the new families through composition-node-view
to retain the 300-line limit. Its type guard preserves closed discriminated unions.
The type-only CompositionCatalog holds the new component contracts, each
importing its own module's Props; the main catalog extends it and retains exhaustive
names checking. Existing declarations and their names remain intact.

The Sidebar private context delta consumes full Dashboard group width and remembers
the actual mobile trigger. Public Sidebar props do not change. Existing Sidebar
dismissal, cancellation and input-retention behavior remain covered.

Earlier pressHandler and action-arguments regressions are preserved. Editorial entries
use PageHeading, which already strips native action arguments. DashboardSearchButton
has a failing-before regression and a zero-argument wrapper. Content search's five
private shared modifications matched their exact baseline hashes before import. These
include Modal portal direction, CommandPalette's native IME guard and the reusable
private command binding model. The preceding parent corrections remain intact.

Pricing imports preserve the focused-control reveal and native scroll-key helpers. Its
sr-only utility is explicitly emitted and checked with actual browser geometry. The
optional PageFamilyNodeView was omitted to preserve the receiving dispatcher. Popover's
reviewed test-only split preserves assertions and the original timeout.

Registry, schema catalog, public exports, exhaustive examples, style imports, template
variables, state/action preflight and dispatch were merged. Docs include twenty-four new
references and runnable examples. Demo mounts keep composition examples outside narrow
SplitView columns. No dependencies, state kinds or public styling escapes were added.

## Verification records

Portable JSON Schema acceptance must register exported standard formats with its strict
consumer validator. Calendar dates retain leap-year validation; unknown formats remain
errors. Integration adds explicit valid/invalid editorial date cases to this acceptance.

Logs live in .cache/integration-*.log. Strict TS7, file policy and type-aware lint,
schema/example freshness, production library/demo build, packed TSX consumer and strict
MkDocs passed before the combined unit/browser gate started. Coverage and browser
results are recorded separately. No threshold or runtime exclusion changed.

Full integrated unit gate: 1307 tests passed in 419 files. Every one of 818 executable
production files has 100% statements, branches, functions and lines. Another 249 files
contain no executable code. Totals: 4880 statements, 3425 branches, 1452 functions and
4487 lines. Report: .cache/coverage/a-integrated/coverage-summary.json.

The earlier run found strict JSON Schema consumers missing the exported date format.
The new shared test consumer registers date validation using z.iso.date(), and explicit
leap-year/invalid-date acceptance passes. Strict unknown-format rejection stays enabled.

The first browser run found old Shell tests using a page-global navigation trigger that
now matched Dashboard as well. The trigger is scoped to its named Application shells
region, preserving every interaction assertion. Four other context-close failures were
ENOSPC infrastructure errors. All sixteen affected cases then passed in a focused rerun.
The final fresh complete browser run includes Pricing and Content too: all 484
production Chromium scenarios passed without retries in 6.7 minutes. The test-owned
preview server stopped afterward. Log: .cache/integration-browser-final.log.

Final gate commands use explicit type-aware lint with --no-ignore because this isolated
workspace sits inside the root's ignored .cache directory. Unit coverage uses two
workers and .cache/vitest-a-integrated; browser execution uses two workers and the
existing test-owned port 4174. Default checks, coverage thresholds and production
coverage paths remain unchanged. All checks ran against this combined snapshot.

Final changed-path manifest: .cache/batches/a-composition-imports/manifest.json. It
records before/after SHA-256 values and keeps log/report copies under evidence/. Shared
aggregates were merged, not replaced. Root source, Git history, DNS and deployment
remain unchanged. The fork-a writer lease returns to the parent with this delivery.

The integration baseline and final changed-path manifest are kept under .cache/ for
parent review. Generated JSON schemas and frozen manifests retain required tool formats;
maintained source, tests and documentation retain 300 lines, 88 columns and two spaces.
