# Page presentation components

Status: implemented in the isolated layout snapshot; root acceptance is pending.

## Concrete contracts

- PageHeader: optional headline/title/description/links/children.
- PageFeature: optional title/description/leading/children/orientation and a named title
  action (href or onPress, optional newWindow for href).
- PageCard: feature content plus header/footer, reverse, variant, intent, highlight and
  spotlight. Variants: solid/outline/soft/subtle/ghost/naked; intent:
  neutral/primary/danger. Spotlight is accessible hover/focus emphasis, rather than an
  unconstrained pointer-coordinate effect.
- PageHero: optional headline/title/description/links/children, header/footer,
  top/bottom, orientation/reverse.
- PageSection: hero content plus optional leading/features.
- Header slots supplement generated headings instead of silently replacing title data.
  Generated headings remain engine-controlled.
- HeadingLevelContext is renderer-owned, bounded to levels one through six. Page and
  Section scope their descendants; new introduction components scope content beneath
  their own title. No application heading-tag prop is exposed. Nested Page uses a
  section under the existing MainScope context.

## Shared rules

PAGE-PRESENTATION-001: PageHeader, PageFeature, PageCard, PageHero and PageSection each
have their own module, schema-derived Props and adapter. They expose semantic content
and closed layout intentions, never native tags, raw icons, CSS classes, dimensions or
styling callback escape hatches.

PAGE-PRESENTATION-002: Titles/headlines are bounded labels, descriptions are bounded
plain text and content slots accept only reacd nodes. All content wraps safely and
remains reachable. Rendered headings use engine-owned semantics appropriate to their
role and nesting.

PAGE-PRESENTATION-003: Links are safe targets and actions are typed callbacks. When both
href and onPress are supplied, validation rejects the declaration. An actionable title
must have a nonempty title. Never wrap arbitrary card children in a link or button:
children may contain their own controls.

PAGE-PRESENTATION-004: Horizontal orientation is a preferred relationship, not a fixed
row. Content reflows intrinsically when space is insufficient. Reverse changes the
actual content-region order so DOM reading order and keyboard order remain consistent
with the visible structure. Regions keep stable identities so controlled field values
survive layout changes.

PAGE-PRESENTATION-005: Appearance variants are a closed, token-backed adapter contract.
Background changes must preserve descendant text/control contrast. No decorative pointer
effect may obscure content, capture input or hide information from keyboard users. Such
effects remain disabled by default.

## PageHeader

A page introduction has optional headline, title, description, links and children. Links
are a safe component slot, replacing upstream ButtonProps arrays. The title supplies
heading semantics; supporting copy is not a second heading. It creates no main landmark
and uses no fixed content height.

## PageFeature

A concise feature has optional title, description, leading and children, orientation,
safe href and onPress. A leading icon or avatar is another validated reacd component.
Navigation/action belongs to the named title, leaving child controls independently
operable.

## PageCard

A card adds optional header, leading, body children and footer to the feature content.
It supports orientation/reverse and closed surface variants. Intent selects a
token-backed decorative emphasis border when highlight is enabled. Text and control
foregrounds retain validated template contrast pairs. Link/action semantics follow the
title-only rule to prevent nested interactive elements.

## PageHero

A primary introduction has optional headline, title, description, links and content
children plus top/header/footer/bottom slots. Horizontal orientation and reverse arrange
introduction and content regions without user breakpoints. The component never injects
fabricated statistics, testimonials or imagery.

## PageSection

A named page section adds optional leading and features slots to the hero content model.
Features are closed reacd components, not raw HTML/configured icon functions. Links and
feature controls remain independent and keyboard reachable. Section separation and width
constraints belong to the adapter.

## Acceptance

1. Strict schemas/type tests reject native children, styling escapes, unsafe links,
   ambiguous target/action combinations and nameless actions.
2. DOM/SSR tests cover optional content, every supported slot and orientation, reversed
   region reading order, independent child actions and heading scope.
3. Jotai examples preserve values across orientation/reverse/template changes.
4. Generative transport validates arrays for every content slot and validates all
   descendant actions before rendering. Direct node actions use registered names, never
   executable functions in JSON.
5. Browser tests cover both templates, 240/320/768/1440 widths, 200% text and LTR/RTL,
   long unbroken labels, focus order, nested controls and containment.
6. Per-file runtime coverage remains 100% for statements/branches/functions/ lines. Root
   coordinates global checks and browser-port allocation.

## Primary references

- https://ui.nuxt.com/docs/components/page-header
- https://ui.nuxt.com/docs/components/page-feature
- https://ui.nuxt.com/docs/components/page-card
- https://ui.nuxt.com/docs/components/page-hero
- https://ui.nuxt.com/docs/components/page-section

Documentation retrieved 2026-10-29 into shared .cache/references/. Upstream as/ui/raw
icon and CSS color maps are intentionally replaced by safe slots, closed logical intent
and adapter design tokens. These adaptations must be documented explicitly instead of
claiming identical unrestricted APIs.
