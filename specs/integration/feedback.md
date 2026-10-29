# Feedback and data integration notes

## User, ProgressGroup, Banner

Implemented separate Props, schema, declaration, shadcn adapter and colocated tests.
Public exports and adapter maps were integrated by the root agent.

- User: `src/components/user/user.tsx`, `userSchema`, `ShadcnUser`.
- ProgressGroup: `src/components/progress-group/progress-group.tsx`,
  `progressGroupSchema`, `ShadcnProgressGroup`.
- Banner: `src/components/banner/banner.tsx`, `bannerSchema`, `ShadcnBanner`.
- Private styles: `user.css`, `progress-group.css`, `banner.css`.
- No additional theme variables.
- Public examples: `UserExample`, `ProgressGroupExample`, `BannerExample` in matching
  `docs/examples/` modules and `docs/components/` reference pages.

Generative schemas live beside component schemas. User uses a registered action
reference. ProgressGroup is a literal leaf. Banner has writable boolean open and
recursive actions. Helpers are `GenerativeUser` and `BoundBanner`. Root integrated
central transport unions, bindings, action references and node rendering.

Fixtures are in `src/state/generative-ui/feedback-integration.test.tsx`; public TSX
examples are independently runnable. Root owns demo catalog and MkDocs links.

Verification 2026-10-29 before public generative integration tests:

- 16 focused suites / 25 tests passed.
- 21 measured production files: statements, branches, functions and lines 100%.
- Five type-only files contain no executable statements.
- Scoped report: `.cache/feedback-coverage/coverage-summary.json`.
- Type-aware focused oxlint passed.
- TSX SSR/hydration passed both templates without recoverable errors.
- Browser geometry, packed consumer and combined checks remain root-owned.

Scoped coverage retained the repository's 100% per-file thresholds and exclusions. No
schema or DOM-less test establishes actual browser geometry.

## Timeline and ScrollArea

- Timeline: `Timeline` / `TimelineProps`, `timelineSchema`, `ShadcnTimeline` in
  conventional component/schema/adapter directories.
- ScrollArea: `ScrollArea` / `ScrollAreaProps`, `scrollAreaSchema`, `ShadcnScrollArea`
  in conventional directories, including own index barrels.
- Private styles: `timeline.css`, `scroll-area.css`; no extra theme variables.
- `timelineNodeSchema` is a leaf. Value is optional literal id or writable text
  reference. `timelineValueSchema(items)` constrains existing event ids. `BoundTimeline`
  takes reference/properties/registry, omitting controlled value and callback from
  properties. Literal nodes remain readonly.
- `ScrollAreaNode<Content>` and `scrollAreaNodeSchema(content)` recursively validate
  required children arrays. Standard child visitation applies.
- Root integrated exports, adapter, transport, bindings, node rendering, MkDocs
  navigation and Content and data example mounts.
- Public examples and reference pages use matching kebab-case names.
- Full transport fixtures: `src/state/generative-ui/timeline-scroll.test.tsx`.

ScrollArea supports bounded, present children rather than Nuxt's optional virtualizer or
direct DOM handles. The specification records this supported subset; no complete
optional-feature parity is claimed.

## Browser fixtures

`demo/e2e/feedback.spec.ts` contains 18 first-batch cases. It exercises both templates,
eight viewport widths, long unbroken identity/banner/segment text, 200% text, RTL,
containment, target size and controlled keyboard interaction. Execution is coordinated
by the root agent. Browser behavior remains unverified until those cases run;
implementation and tests are separate evidence.
