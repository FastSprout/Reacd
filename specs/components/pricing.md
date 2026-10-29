# Pricing components

Status: specified for the next isolated Agent A batch. No commercial offer is implied by
the reference examples.

PRICING-001: PricingPlan has optional title/description/price/discount/billingCycle/
billingPeriod/tagline/terms, safe badge/button/header/children/footer slots, closed
features, orientation, variant, highlight and scale. Discount requires an original
price; original price is struck through and discount is the current displayed price.
Values are explicit host strings; the renderer never calculates money or discount rates.

PRICING-002: Features are bounded plain labels or uniquely keyed records with a title
and optional safe leading content. Native tags, icon functions, style objects and vendor
ButtonProps bags are rejected. Button is a safe component slot, so its real action and
state stay in the host application. Child controls remain independently operable.

PRICING-003: PricingPlans accepts optional keyed plan arrays and safe children,
horizontal or vertical orientation, compact and scale defaults. Host order and plan
identity remain stable. Compact changes template spacing; scale uses in-flow emphasis
without transforms, offsets or overlap. Individual plans may override scale.

PRICING-004: PricingTable requires an accessible caption, uniquely identified tiers and
sections. Every section has unique feature IDs. Every feature's tier-value map contains
exactly the declared tier IDs: missing, extra or duplicate identities are errors. Values
are finite numbers, nonempty strings or booleans. Boolean cells have explicit
Included/Not included text rather than unlabeled decorative glyphs.

PRICING-005: The table uses native caption/header/row-group/cell semantics and a named,
keyboard-focusable horizontal scroll region at narrow widths. Scrolling remains local to
the comparison; the document must not overflow. Tier actions are safe component slots.
Physical column constraints and prominence factors live in named core policy. The
visible caption remains outside the scrolled content. Focused controls fit the scroll
viewport and are revealed after native focus placement. Arrow keys on the region scroll
instantly by an engine-owned step; keys inside controls retain native behavior.

PRICING-006: Generative transport replaces every safe slot with arrays and traverses
standalone plans, keyed collections, feature-leading content and every tier slot before
rendering. All child actions and bindings are validated. Prices, inclusion claims,
customer statistics and recommended-plan badges are never fabricated by examples.

Acceptance requires closed schema/consumer tests, deterministic SSR/hydration,
meaningful state/action tests, 100% per-file runtime coverage, and both templates at
240/320/768/1440 with scoped LTR/RTL and 200% text. Browser checks measure real local
scroll containment, keyboard access, in-flow prominence and independent plan actions.

Primary references cached 2026-10-29:

- https://ui.nuxt.com/docs/components/pricing-plan
- https://ui.nuxt.com/docs/components/pricing-plans
- https://ui.nuxt.com/docs/components/pricing-table

Safe slots replace raw component-prop bags. Prominence remains in flow instead of Nuxt's
optional transform scaling, protecting neighboring controls and long text.
