# Editorial page components

Status: implemented in an isolated snapshot; combined root acceptance is pending.
Earlier frozen deliveries remain unchanged.

## BlogPost and ChangelogVersion

EDITORIAL-001: Every entry exposes optional title/description, canonical ISO calendar
date with an optional explicit dateLabel, safe title href or onPress, newWindow, image
DTO, orientation, surface variant and safe header/badge/authors/body/footer/actions
slots. The image DTO requires validated HTTP(S)/root-relative src and a meaningful alt.
No native image attributes, HTML body, CSS, tag override or arbitrary icon function is
accepted. Title actions require a title and are mutually exclusive with href.

EDITORIAL-002: Dates are validated calendar dates, not ambient Date/Intl objects. An
explicit dateLabel requires a date. Display defaults to the canonical date string so SSR
and client output do not depend on clock, locale or timezone defaults. Body content is
composed from reacd components. Raw Markdown/HTML is not interpreted.

EDITORIAL-003: ChangelogVersion additionally has a closed indicator boolean (default
true). The indicator is decorative, never the sole representation of version/date. No
implicit scroll-based progress, spring physics or application DOM querying is added.

EDITORIAL-004: Native semantic articles and bounded context headings contain independent
child controls. Optional media and copy prefer the chosen orientation and wrap
intrinsically. Images reserve named engine dimensions and contain their content. A
failed source displays an honest, accessible fallback; changing source resets failure.
No image, author identity, trust claim or publication metric is fabricated by examples.

## BlogPosts and ChangelogVersions

EDITORIAL-005: Collections accept optional keyed entry arrays and safe children.
Structured entries have unique semantic keys. Supplied content supplements entries,
never silently replaces them. Empty collections are valid. BlogPosts supports closed
horizontal (responsive grid) or vertical orientation. ChangelogVersions supports the
decorative indicator default for its entries, overridable per entry. No sorting, date
inference or implicit data fetching changes host order.

EDITORIAL-006: Generative entries replace callbacks with registered action names and
every safe slot with arrays. Collections validate keyed entry declarations and safe
child arrays. Every nested slot action and state reference is visited before rendering.
JSON remains optional transport for the same closed TSX declarations.

## Acceptance

- Strict consumer/schema checks reject unsafe image/URL values, invalid calendar dates,
  duplicate keys, executable transport callbacks and styling/native attribute escapes.
- DOM/SSR/hydration tests cover explicit/omitted data, source failure/reset, semantic
  heading levels, independent actions, all collection modes and slot traversal.
- Documentation examples compile and use Jotai for actual local interactions.
- Browser checks cover both templates, narrow/wide LTR/RTL at 200% text, actual image
  reserve/failure behavior, independent actions, and preserved state through reflow.
- Every changed executable file retains 100% statement/branch/function/line coverage.
  Combined root acceptance remains distinct from snapshot evidence.

## Primary references

Cached documentation retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/blog-post
- https://ui.nuxt.com/docs/components/blog-posts
- https://ui.nuxt.com/docs/components/changelog-version
- https://ui.nuxt.com/docs/components/changelog-versions

Closed safe slots replace vendor User/Badge property bags and raw image attributes.
Host-explicit calendar strings and static indicators replace ambient Nuxt date/scroll
integration. These adaptations must remain explicit in the public reference.
