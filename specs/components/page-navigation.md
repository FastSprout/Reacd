# Page navigation, calls to action and semantic anchors

Status: implemented in the isolated layout snapshot; combined acceptance is pending.
The earlier frozen presentation delivery remains unchanged.

## Semantic anchors

PAGE-ANCHOR-001: Page, Section, PageHeader and PageSection accept an optional anchor
identifier. It starts with an ASCII letter and contains only letters, digits, hyphens
and underscores, bounded by CONTENT_POLICY.maxIdentifierLength. It becomes the generated
heading ID and a programmatic focus target. Without it, renderer-owned useId remains the
fallback. The host must supply unique identifiers across its complete document.

PAGE-ANCHOR-002: Enclosing named sections refer to that same heading ID. Trusted styles
own anchor scroll clearance. The property conveys a content identity, not an HTML-id,
native tag, attribute, style or DOM escape hatch. Content navigation can reference it
with a safe fragment URL. Native fragment navigation must work without application DOM
mutation. Heading levels remain bounded by the presentation heading context.

## Page

PAGE-SHELL-001: Existing Page keeps its required title, optional subtitle and safe body.
Optional left/right slots add the defining three-region page layout. Regions appear in
left/body/right declaration order and reflow intrinsically without hiding navigation.
Title and primary landmark behavior remain compatible; nested Page renders a section. No
breakpoint, column width or native element override is public.

PAGE-SHELL-002: Page and Section generative nodes use required children arrays and
optional arrays for supported additional slots. All slot actions and bindings are
validated before rendering. Anchor declarations use the same schema in TSX/transport.

## PageAnchors and PageLinks

PAGE-LINKS-001: Both components expose a required accessible label, optional links and
optional activeKey. PageLinks additionally supports a title. Each link has a unique
semantic key, label, validated href, optional safe leading content and newWindow.
Unknown active keys, duplicate keys, unsafe targets, native children and styling hooks
are rejected. Empty link collections remain valid and do not invent destinations.

PAGE-LINKS-002: The adapter owns nav/list/anchor semantics, minimum pointer targets,
wrapping, keyboard focus and safe new-window metadata. Active state is host supplied;
there is no ambient router or implicit scrollspy. Browser navigation uses native links
and preserves modified-click behavior. General safe internal/external targets match the
upstream PageAnchors intent; the component is not restricted to same-page anchors.

PAGE-LINKS-003: Generative link items replace leading content with optional arrays.
Descendant actions and state references inside leading content are traversed. Transport
contains no executable callback, raw HTML, CSS or component constructor.

## PageCTA

PAGE-CTA-001: A call-to-action section has optional title/description, safe links and
children, top/header/footer/bottom slots, orientation/reverse and a closed surface
variant: solid, outline, soft, subtle or naked. The engine owns heading scope and
intrinsic reflow. Controls in links and content stay independent; no whole-section
interactive wrapper is created. Declared actions must actually run.

PAGE-CTA-002: Surface variants retain validated foreground/background pairs and do not
hide long text. Reverse reorders keyed content regions and preserves controlled state.
The generative node traverses every slot before rendering. Supporting images or trust
claims are never fabricated by the component or its reference examples.

## Acceptance

- Failing schema/consumer tests precede implementation of new public contracts.
- Each new component has a separate module, named schema-derived Props, shadcn registry
  entry, compiled TSX reference and generative coverage.
- DOM/SSR/hydration tests verify anchor IDs/focus semantics, three Page regions, closed
  surfaces, safe targets, heading scope and complete slot traversal.
- Real browser cases cover both templates, 240/320/768/1440, scoped LTR/RTL and 200%
  text, actual native fragment navigation, keyboard order, containment and state reuse.
- Changed executable files retain 100% statements/branches/functions/lines. Combined
  root checks remain the integrating agent's acceptance responsibility.

## Primary references

Cached upstream documentation retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/page
- https://ui.nuxt.com/docs/components/page-anchors
- https://ui.nuxt.com/docs/components/page-links
- https://ui.nuxt.com/docs/components/page-cta

Raw as/ui/class/icon-function options are replaced with semantic content and closed
component slots. React's host controls active links and state explicitly.
