import type { ReactNode } from 'react';
import { PricingPlan, PricingPlans, PricingTable } from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { PricingNode } from '../../schema/generative-v2/pricing-nodes.schema.js';

export function PricingNodeView({
  node,
  renderChild,
}: {
  node: PricingNode<GenerativeNode>;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  if (node.type === 'PricingPlans') {
    const { type: _type, children, plans, ...properties } = node;
    return (
      <PricingPlans {...properties}>
        {plans?.map(({ key, ...plan }) => (
          <PricingNodeView
            key={key}
            node={{ ...plan, type: 'PricingPlan' }}
            renderChild={renderChild}
          />
        ))}
        {children.map(renderChild)}
      </PricingPlans>
    );
  }
  if (node.type === 'PricingTable') {
    const { type: _type, tiers, ...properties } = node;
    return (
      <PricingTable
        {...properties}
        tiers={tiers.map((tier) => ({
          ...tier,
          badge: tier.badge?.map(renderChild),
          button: tier.button?.map(renderChild),
        }))}
      />
    );
  }
  const {
    type: _type,
    children,
    badge,
    button,
    header,
    footer,
    features,
    ...properties
  } = node;
  return (
    <PricingPlan
      {...properties}
      badge={badge?.map(renderChild)}
      button={button?.map(renderChild)}
      header={header?.map(renderChild)}
      footer={footer?.map(renderChild)}
      features={features?.map((feature) =>
        typeof feature === 'string'
          ? feature
          : {
              ...feature,
              leading: feature.leading?.map(renderChild),
            },
      )}
    >
      {children.map(renderChild)}
    </PricingPlan>
  );
}
