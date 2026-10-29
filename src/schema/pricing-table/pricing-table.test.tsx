import { describe, expect, it } from 'vitest';
import { pricingTableSchema } from './pricing-table.schema.js';
import { pricingPlanSchema } from '../pricing-plan/pricing-plan.schema.js';
import { pricingPlansSchema } from '../pricing-plans/pricing-plans.schema.js';

const valid = {
  caption: 'Illustrative comparison',
  tiers: [{ id: 'basic', title: 'Example' }],
  sections: [
    {
      id: 'access',
      title: 'Access',
      features: [
        { id: 'feature', title: 'Illustrative feature', tiers: { basic: true } },
      ],
    },
  ],
};

describe('closed pricing declarations', () => {
  it('accepts explicit comparison values and rejects incomplete matrices', () => {
    expect(pricingTableSchema.safeParse(valid).success).toBe(true);
    for (const sections of [
      [
        {
          id: 'access',
          title: 'Access',
          features: [{ id: 'wrong', title: 'Wrong key', tiers: { extra: true } }],
        },
      ],
      [
        {
          id: 'access',
          title: 'Access',
          features: [{ id: 'feature', title: 'Feature', tiers: {} }],
        },
      ],
      [
        {
          id: 'access',
          title: 'Access',
          features: [
            { id: 'feature', title: 'Feature', tiers: { basic: true, extra: false } },
          ],
        },
      ],
      [
        {
          id: 'access',
          title: 'Access',
          features: [
            { id: 'same', title: 'One', tiers: { basic: true } },
            { id: 'same', title: 'Two', tiers: { basic: 1 } },
          ],
        },
      ],
      [valid.sections[0], valid.sections[0]],
    ])
      expect(pricingTableSchema.safeParse({ ...valid, sections }).success).toBe(false);
    expect(
      pricingTableSchema.safeParse({
        ...valid,
        tiers: [valid.tiers[0], valid.tiers[0]],
      }).success,
    ).toBe(false);
    expect(pricingTableSchema.safeParse({ ...valid, caption: '' }).success).toBe(false);
  });

  it('keeps plans explicit, keyed and free of vendor styling escapes', () => {
    expect(
      pricingPlanSchema.safeParse({
        price: 'Example price',
        discount: 'Example discounted price',
        features: ['Example feature'],
      }).success,
    ).toBe(true);
    expect(pricingPlanSchema.safeParse({ discount: 'No original price' }).success).toBe(
      false,
    );
    expect(
      pricingPlanSchema.safeParse({
        features: [
          { key: 'same', title: 'One' },
          { key: 'same', title: 'Two' },
        ],
      }).success,
    ).toBe(false);
    expect(pricingPlanSchema.safeParse({ className: 'custom' }).success).toBe(false);
    expect(
      pricingPlansSchema.safeParse({ plans: [{ key: 'same' }, { key: 'same' }] })
        .success,
    ).toBe(false);
  });
});
