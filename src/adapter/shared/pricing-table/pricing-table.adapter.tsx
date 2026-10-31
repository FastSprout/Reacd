import type { ReactNode } from 'react';
import type { PricingTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-table/pricing-table.props.js';
import { PRICING_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';
import { PricingPrice } from
  '@fastsprout/reacd/adapter-runtime/renderer/pricing/pricing-price.js';
import { pricingValue } from
  '@fastsprout/reacd/adapter-runtime/renderer/pricing/pricing-value.js';
import { revealFocusedControl } from
  '@fastsprout/reacd/adapter-runtime/renderer/scroll/reveal-focused-control.js';
import { scrollRegionByKey } from
  '@fastsprout/reacd/adapter-runtime/renderer/scroll/scroll-region-key.js';

export function SharedPricingTable({
  caption,
  tiers,
  sections,
}: PricingTableProps): ReactNode {
  return (
    <div className="reacd-node reacd-pricing-comparison">
      <p className="reacd-pricing-caption" aria-hidden="true">
        {caption}
      </p>
      <div
        className="reacd-node reacd-pricing-table-region"
        role="region"
        aria-label={caption}
        tabIndex={0}
        onKeyDown={scrollRegionByKey}
        onFocusCapture={(event) =>
          revealFocusedControl(event.target, event.currentTarget)
        }
      >
        <table className="reacd-pricing-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{PRICING_DEFAULTS.featureHeader}</th>
              {tiers.map((tier) => (
                <th key={tier.id} scope="col" data-highlight={tier.highlight}>
                  <div className="reacd-pricing-tier">
                    {tier.badge}
                    <strong>{tier.title}</strong>
                    {tier.description !== undefined && <p>{tier.description}</p>}
                    <PricingPrice {...tier} />
                    {tier.button}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {sections.map((section) => (
            <tbody key={section.id}>
              <tr>
                <th scope="rowgroup" colSpan={tiers.length + 1}>
                  {section.title}
                </th>
              </tr>
              {section.features.map((feature) => (
                <tr key={feature.id}>
                  <th scope="row">{feature.title}</th>
                  {tiers.map((tier) => (
                    <td key={tier.id}>{pricingValue(feature.tiers[tier.id])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
