# Page navigation delivery

Workspace: .cache/workspaces/layout. This batch extends the frozen Page presentation
delivery without modifying that frozen copy. Exact new/modified paths and SHA-256
digests: .cache/batches/page-navigation/manifest.json. Source: adjacent files/ tree.

## Accepted snapshot scope

New inventory modules: PageAnchors, PageLinks and PageCTA. Existing Page gains its
defining optional left/right composition regions, alongside title/subtitle/body. Root
inventory acceptance covers four entries only after combined integration checks.

Requirements: specs/components/page-navigation.md. No new dependency, state kind,
application HTML/CSS, native event property or component rendering escape is introduced.

## Anchor foundation

Shared identifierSchema lives at schema/shared/identifier.ts. It reuses
CONTENT_POLICY.maxIdentifierLength (80) and accepts an ASCII letter first, then letters,
digits, hyphens and underscores. Page, Section, PageHeader and PageSection accept
anchor. Optional-title components reject anchor without a title, including in transport.

The anchor becomes the generated heading's ID and programmatic tabindex target. Named
sections reference that same heading. Without it, useId supplies deterministic fallback
IDs. Native keyboard fragment navigation moves focus to the real heading. Hosts must
keep anchors unique across the document; the API does not expose arbitrary HTML IDs.

This shared identity contract is suitable for the parent-owned ContentToc. Preserve
generated fallback IDs and the heading scope from the earlier presentation batch.

## Closed APIs and integration

- PageAnchors: required label, optional links/activeKey.
- PageLinks: anchors contract plus optional title.
- Link items: unique key, label, safe href, optional safe leading content/newWindow.
  Unknown active keys and unsafe targets are rejected. Active state belongs to the host.
  There is no implicit router or scrollspy. Links remain native with modified clicks.
- PageCTA: introduction and safe links/content/top/header/footer/bottom slots, preferred
  orientation, keyed reverse and solid/outline/soft/subtle/naked variants.
- Page: required title, optional subtitle/anchor/left/right/body. All regions remain in
  left/body/right reading order at narrow widths. Nested Page renders a section.

Merge catalog/export additions and pageNavigationEntries deliberately. Add
pageNavigationVariables() to template variables and import page-navigation.css. The
stylesheet also fixes Page's shrink-to-content width when nested in a flex column; the
real browser geometry regression failed before the fix.

PageCTA extends PageIntroduction's closed kind map with cta. The CSS shares card
surfaces and gives CTA a section-level title scale. PageLinks titles and Page's bounded
dynamic headings have explicit engine-owned typography/margins.

### Generative transport

Five generic node types are added directly to GenerativeNode: Page, Section, PageCTA,
PageAnchors and PageLinks. Register pageNavigationNodeSchemas(). Do not wrap the
recursive alias through an intermediate generic union. PageNavigationNodeView maps safe
slots.

Visitor additions: Page left/right, link-item leading arrays, every CTA slot. Ordinary
children use the existing visitor. All nested action/state references are checked before
rendering. Optional PageHeader/PageSection anchor refinements must be preserved in both
public and generative schemas.

Mount PageNavigationExamples before SplitView, beside presentation examples. Merge four
MkDocs references, compiled examples and conformance fixtures. Update PageHeader and
PageSection docs with the semantic anchor contract. Do not overwrite root RTL,
Pagination, form-bridge or inherited-action lookup corrections.

## Verification evidence

- Red acceptance: page-anchors schema tests failed before modules existed.
- Combined presentation/navigation scope: 31 test files, 47 passing tests.
- 68 executable files have 100% statements/branches/functions/lines; 16 type-only/barrel
  files are empty. Coverage: 186 statements, 130 branches, 61 functions, 181 lines.
- Report: .cache/coverage/page-navigation/coverage-summary.json.
- Strict types, lint, source policy, production build, packed-package consumer and
  strict MkDocs passed. Logs: .cache/page-navigation-{types,lint,policy,build,package,
  docs}.log.
- Final production Chromium: 32 passing cases, 16 navigation plus 16 presentation
  regressions. Both templates, 240/320/768/1440 widths, scoped LTR/RTL and 200% text.
  Checks include real three-region wide geometry, narrow containment, native fragment
  keyboard activation/focus, independent CTA action, state retention and template swap.
- Browser log: .cache/page-navigation-browser.log. Preview port 5176 is stopped after
  verification.

Combined root runtime coverage, remaining browser regressions and generated-schema
freshness remain the integrating agent's final gate. Snapshot checks are not proof of
all browser correctness or full enterprise completion.
