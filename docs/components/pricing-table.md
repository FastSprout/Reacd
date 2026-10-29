---
template: preview.html
reacd_preview: PricingTable
reacd_preview_height: 560
---

# PricingTable

PricingTable presents explicit pricing information using closed reacd components.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/pricing-table.tsx"
```

## Plan contract

PricingPlan accepts optional title/description/price/discount,
billingCycle/billingPeriod, tagline/terms and safe badge/button/header/children/footer
slots. Discount requires the original price, which is struck through. No monetary
calculation or automatic claim is made. Features are plain labels or uniquely keyed
title/leading records. Orientation is vertical by default; variants are solid, outline,
soft and subtle. Highlight and scale default false. Scale adds in-flow prominence,
preserving neighboring content.

PricingPlans accepts optional keyed plans and safe children. Horizontal is the default
collection orientation; vertical, compact and scale are supported. Plans may override
inherited scale. Children supplement the supplied records. Host order stays unchanged.

## Comparison contract

PricingTable requires a caption, uniquely identified tiers and sections. Every feature
has a unique ID in its section and a tier-value map containing exactly the declared tier
IDs. Boolean, finite numeric and nonempty text values are supported. Missing/extra cells
are rejected. Booleans display Included/Not included text. Native table semantics and a
named keyboard-focusable local scroll region keep comparisons reachable on narrow
screens.

Tier badge/button values are safe component slots. Raw vendor props, native tags,
classes and CSS are rejected. Dates, amounts, discounts and availability claims are host
data. All reference examples are explicitly illustrative and are not commercial offers.

## Generative transport

Version 0.2 uses required children arrays for plans/collections and optional arrays for
all supported content slots. Keyed plans, feature leading content and tier slots are
traversed for registered actions and state bindings before rendering. Complete tier
matrices are validated in memory. Browser containment/focus still require conformance
checks; schema validity is not proof of rendering correctness.
