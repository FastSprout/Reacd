# Agent B: Carousel and Marquee

Scope: CAROUSEL-001..007 and MARQUEE-001..006 in fork-b only. Curated adaptations;
no claim of arbitrary upstream slots, CSS, drag engines or forced autoplay.
No dependency changes. Root inventory acceptance belongs to Agent A.

## Exported contracts

- Carousel, CarouselProps and CarouselItem from components/carousel/index.ts.
  Controlled integer value, required labelled unique-id items, logical orientation,
  loop, protected navigation and ready/loading/error/empty/retry states.
- Marquee and MarqueeProps from components/marquee/index.ts. Controlled paused
  boolean, bounded text-only notices, semantic pace and logical direction.
- carouselSchema, carouselSettingsSchema, carouselValueSchema, CarouselNode<Child>
  and carouselNodeSchema from schema/carousel/index.ts.
- marqueeSchema, marqueeContentSchema and marqueeNodeSchema from schema/marquee.
- CarouselNodeView and BoundMarquee own state modules; isolated Jotai state references.
- CarouselExample and MarqueeExample compile as runnable TSX reference examples.

## Integration already composed in B's snapshot

Exclusive shared-write window was delegated by B's parent and then released.
Merge additions deliberately; do not replace root aggregates with snapshot files.

- components/catalog.ts adds Props/name entries; components/index.ts exports both.
- adapter/shadcn/shadcn.adapter.ts merges carouselEntries and marqueeEntries.
- adapter/shadcn/__tests__/examples.tsx merges both exhaustive fixture maps.
- adapter/shadcn/styles.css imports both owned CSS modules.
- renderer/theme/template-variables.ts spreads marqueeVariables().
- schema/generative-v2/document.schema.ts directly includes recursive
  CarouselNode<GenerativeNode>, avoiding TS7 intermediate recursive aliases.
- schema/generative-v2/leaf-nodes.schema.ts adds marqueeNodeSchema.
- schema/generative-v2/action-references.ts discovers optional Carousel retryAction.
- schema/generative-v2/catalog-bindings.ts binds bounded Carousel number state and
  boolean Marquee pause state with explicit read/readWrite access.
- document.schema.ts's visitGenerativeNodes visits inactive and active slide children.
- state/generative-ui/node-view.tsx dispatches both owned state renderers.
- demo/catalog/data-examples.tsx mounts both compiled examples.
- mkdocs.yml includes both public reference pages, excluding internal specifications.

## Behavioral evidence

Inactive slides remain mounted but use a disabled fieldset plus hidden/inert boundary.
This prevents invisible required fields from blocking active form submission and
excludes inactive native controls from FormData. Portal context and a panel-local
portal host suppress inactive popups while preserving React state. A pre-mutation
focus snapshot repairs external host transitions without stealing outside focus.

Marquee moving copies contain text only and are inert/aria-hidden. Native disclosure
exposes the original complete notices. Explicit pause persists after leaving focus;
hover/reading-focus additionally pause motion temporarily. Unknown/reduced motion
and readOnly render truthful static text without dead motion controls. SSR never
claims an unknown preference was requested by the user.

## Verification

- Acceptance-first missing-module logs: .cache/carousel-before.log and
  .cache/marquee-before.log. .cache/carousel-forms-before.log captures the failing
  invisible required-control regression before the fieldset fix.
- .cache/data-unit.log: 30 tests in 17 files passed; .cache/data-transport.log adds
  two complete recursive transport/action/binding regressions.
- .cache/data-coverage-final.log and .cache/data-coverage-final/coverage-summary.json
  record the refreshed combined 32-test scoped run. Every owned executable file
  has 100% statements, branches, functions and lines; global includes/thresholds
  are unchanged. Focused invocation exits nonzero for unrelated unexercised files.
- .cache/data-lint.log: explicit oxlint --no-ignore --type-aware --deny-warnings.
- .cache/data-owned-policy.log: zero owned source-policy violations. Whole snapshot
  .cache/data-source-policy.log reports only concurrent Form/textarea/switch paths.
- .cache/data-demo-build.log: Vite production demo compilation passed.
- .cache/data-browser-final.log: all 20 Chromium scenarios passed on port 5197,
  both profiles, 240/360/768/1440, 200% text, RTL, forms, focus and real motion.
- .cache/data-docs-final.log: MkDocs --strict passed with root's installed Python
  interpreter and output isolated under fork-b/.cache/data-docs-site.
- Whole snapshot type/build attempts are recorded separately. Concurrent FormField,
  Switch and Textarea Props exports were unresolved at that moment. No Data type
  errors were reported. Do not interpret scoped success as full repository acceptance.

## Delivery paths and upstream material

.cache/data-owned.json lists the component-owned source/docs/spec/test paths.
The frozen batch contains those exact files and a checksummed manifest; shared
aggregates are integration proposals, never replacement copies.
Tool-generated logs, coverage, cached upstream Vue and frozen manifests retain their
formats outside maintained-source limits. No runtime production file is excluded.

.cache/data-upstream.json records official Nuxt Carousel/Marquee Vue sources and
SHA256 hashes. WAI Carousel and WCAG Pause/Stop/Hide references informed behavior:

- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html

Chart and Table are separately specified follow-up work, not included in this delivery.
