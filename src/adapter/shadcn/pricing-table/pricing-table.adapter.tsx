import { useId } from 'react';
import type { PricingTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-table/pricing-table.props.js';
import { PRICING_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';
import { TABLE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '../vendor/ui/table.js';
import { CardTitle, CardDescription } from '../vendor/ui/card.js';
import { ShadcnPlanPrice } from '../pricing-plan/price.js';
import { pricingCellText } from './cell-text.js';

export type ShadcnPricingTableProps = PricingTableProps;
export function ShadcnPricingTable({ caption, tiers, sections }: PricingTableProps) {
  const id = useId();
  const minimum = `${PAGE_PRESENTATION_POLICY.contentTrackRem}rem`;
  return (
    <Table
      containerProps={{
        role: 'region',
        'aria-labelledby': id,
        tabIndex: TABLE_POLICY.scrollTabIndex,
      }}
    >
      <TableCaption id={id}>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            scope="col"
            className="whitespace-normal [overflow-wrap:anywhere]"
            style={{ minInlineSize: minimum }}
          >
            {PRICING_DEFAULTS.featureHeader}
          </TableHead>
          {tiers.map((tier) => (
            <TableHead
              key={tier.id}
              scope="col"
              className={[
                'whitespace-normal [overflow-wrap:anywhere]',
                tier.highlight ? 'bg-accent text-accent-foreground' : '',
              ].join(' ')}
              style={{ minInlineSize: minimum }}
            >
              {tier.badge}
              <CardTitle>{tier.title}</CardTitle>
              {tier.description && (
                <CardDescription>{tier.description}</CardDescription>
              )}
              <ShadcnPlanPrice
                price={tier.price}
                discount={tier.discount}
                billingCycle={tier.billingCycle}
                billingPeriod={tier.billingPeriod}
              />
              {tier.button}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {sections.map((section) => (
        <TableBody key={section.id}>
          <TableRow>
            <TableHead
              scope="rowgroup"
              colSpan={tiers.length + 1}
              className="whitespace-normal [overflow-wrap:anywhere]"
            >
              {section.title}
            </TableHead>
          </TableRow>
          {section.features.map((feature) => (
            <TableRow key={feature.id}>
              <TableHead
                scope="row"
                className="whitespace-normal [overflow-wrap:anywhere]"
              >
                {feature.title}
              </TableHead>
              {tiers.map((tier) => (
                <TableCell
                  key={tier.id}
                  className="whitespace-normal [overflow-wrap:anywhere]"
                >
                  {pricingCellText(feature.tiers[tier.id])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  );
}
