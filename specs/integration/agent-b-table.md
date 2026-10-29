# Agent B: Table delivery

Scope: TABLE-001..006 in fork-b. Existing static calls remain compatible. Interactive
Table reuses DataTable query, native controls and compound controller constraints; it
does not introduce a second query engine. No component-specific dependency changes.

## Contracts

TableProps is a named per-component static/interactive union. StaticTableProps and
InteractiveTableProps are exported from components/table/index.ts. Static calls retain
caption/string columns/string rows; the interactive branch requires mode and a complete
controlled model, with optional onModelChange and per-field editable permissions.

schema/table/table.schema.ts preserves tableComponentSchema's old static shape and
adds staticTableContentSchema, staticTableSchema, validStaticTable and
tableDeclarationSchema. Own interactive.schema.ts validates complete models and
coherent permissions. Own generative.schema.ts exports tableNodeSchema and
InteractiveTableNode. It uses nested mode discrimination so the outer generative type
discriminator remains valid under Zod and TypeScript 7.

Every transition requests a complete model. Sorting/filtering reset the page in the
same update. Host rejection preserves the previous view. Per-binding readers never
acquire writes. Source rows/columns cannot be replaced through view capabilities;
the existing host controller reconciles selection/pagination during source replacement.

BoundTable owns the validated controller; TableSession uses a stable external-store
lease connection and controller-local Jotai error atom. The server does not subscribe.
Client subscription installs compound constraints and unmount releases them. Failed
connections hide controls. No React state is synchronously reset inside an effect.

## Shared integration already composed in B

The parent delegated a short Table aggregate window; it has been released.

- registry/content.ts changes Table's entry to tableDeclarationSchema + ShadcnTable.
- leaf-nodes.schema.ts imports/re-exports the owned tableNodeSchema.
- binding-contracts.ts delegates interactive Table's five bindings to the existing
  DataTable contracts; static Table has no bindings.
- validate-document.ts applies validateInitialTable to both interactive node types.
  Static row-dimension validation moved into the owned static node schema. Existing
  invalid-static-row regressions still reject the same data.
- action-references.ts registers optional Table retryAction.
- node-view.tsx delegates Table to AdditionalNodeView; that helper invokes
  GenerativeTable. Main dispatch stayed below 300 lines.
- data-examples.tsx mounts TableExample; mkdocs.yml adds components/table.md.

Merge these additions deliberately. Do not replace root aggregates wholesale.
The version 0.1 document contract is unchanged.

## Verification

- Acceptance-first logs: .cache/table-before.log, .cache/table-adapter-before.log,
  .cache/table-commit-before.log, .cache/table-transport-before.log,
  .cache/table-docs-before.log and .cache/table-connection-before.log.
- .cache/table-coverage-final.log: 23 tests across 11 files passed. All 15 owned
  executable files have 100% statements/branches/functions/lines, with covered totals
  124/89/40/114. Global coverage includes/thresholds are unchanged. Scoped coverage
  exits nonzero only for unrelated unexercised production files.
- .cache/table-lint-final.log: explicit --no-ignore --type-aware --deny-warnings passes.
- .cache/table-owned-policy-final.log: zero owned source-policy violations.
- .cache/table-build-final.log: the official npm run build passed.
- .cache/table-browser-final.log: all ten production Chromium scenarios passed on
  port 5197, both profiles, 240/360/768/1440, 200% text, actual RTL, keyboard sorting,
  filtering, host rejection, permissions, empty/loading/error/retry and local scrolling.
- Native form tests verify action buttons never submit the surrounding form.
- SSR/hydration tests verify request-local models, no recoverable mismatches, no
  server-side leases and client subscription cleanup.
- .cache/table-desktop.png and .cache/table-narrow.png were visually inspected.
  Wide data stays inside the named keyboard scroll region at narrow zoomed widths.
- .cache/table-docs.log: MkDocs strict build passed with isolated local output.
- .cache/table-types-final-pass.log: all four strict TypeScript projects passed with
  the current runtime, declarations, consumer/type tests and compiled examples.

## Paths and boundaries

.cache/table-owned.json lists owned paths; .cache/batches/table/manifest.json separates
new files from the five modified existing component/schema/renderer files. The frozen
batch contains only owned files, not shared aggregate replacements.
The superseded .cache/table-draft backup is not part of this delivery.

.cache/references/table-nuxt.vue is the official Nuxt Table source. Its source URL and
SHA256 are recorded in .cache/table-upstream.json. It is not copied into production.
Tool-generated coverage, screenshots, logs and manifests retain their required formats.
No runtime code is excluded from coverage. Full root acceptance remains Agent A's job.
