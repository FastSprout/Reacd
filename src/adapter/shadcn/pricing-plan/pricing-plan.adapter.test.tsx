import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Input,
  PricingPlan,
  PricingPlans,
  PricingTable,
  ReacdProvider,
  Text,
} from '../../../index.js';
import { PRICING_VARIANTS } from '../../../core/pricing-policy.js';
import { pricingValue } from '../../../renderer/pricing/pricing-value.js';

describe('closed pricing adapters', () => {
  it('renders explicit prices, safe slots and independent child actions', async () => {
    const user = userEvent.setup();
    const choose = vi.fn();
    const edit = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PricingPlan
          title="Illustrative plan"
          description="Not a commercial offer"
          price="Example original price"
          discount="Example discounted price"
          billingCycle="Example period"
          billingPeriod="Example billing context"
          tagline="Example plan type"
          terms="Illustrative terms"
          header="Plan header"
          footer="Plan footer"
          badge={<Text>Example badge</Text>}
          orientation="horizontal"
          highlight
          scale
          features={[
            'Example label',
            {
              key: 'structured',
              title: 'Keyed feature',
              leading: <Button label="Inspect feature" onPress={edit} />,
            },
          ]}
          button={<Button label="Choose example plan" onPress={choose} />}
        >
          Plan body
        </PricingPlan>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Choose example plan' }));
    await user.click(screen.getByRole('button', { name: 'Inspect feature' }));
    expect(choose).toHaveBeenCalledOnce();
    expect(edit).toHaveBeenCalledOnce();
    expect(screen.getByText('Example original price').tagName).toBe('S');
    expect(screen.getByRole('article')).toHaveTextContent('Plan body');
    expect(screen.getByRole('article')).toHaveTextContent('Illustrative terms');
  });

  it('keeps collection scale defaults overridable and null children invisible', () => {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PricingPlans
          compact
          scale
          plans={[
            { key: 'inherited', title: 'Inherited plan', price: 'Example price' },
            { key: 'override', title: 'Override plan', scale: false },
          ]}
        >
          {false}
          <PricingPlan title="Child plan" />
        </PricingPlans>
        <PricingPlans orientation="vertical" />
        {PRICING_VARIANTS.map((variant) => (
          <PricingPlan key={variant} variant={variant} />
        ))}
      </ReacdProvider>,
    );
    for (const name of ['Inherited plan', 'Child plan']) {
      expect(screen.getByRole('article', { name })).toHaveAttribute(
        'data-scale',
        'true',
      );
    }
    expect(screen.getByRole('article', { name: 'Override plan' })).toHaveAttribute(
      'data-scale',
      'false',
    );
    expect(
      renderToString(
        <ReacdProvider adapter={shadcnAdapter}>
          <PricingPlan />
        </ReacdProvider>,
      ),
    ).toContain('reacd-pricing-plan');
  });

  it('exposes semantic comparison groups and explicit boolean values', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PricingTable
          caption="Illustrative comparison"
          tiers={[
            {
              id: 'one',
              title: 'Example tier one',
              description: 'Example context',
              price: 'Example price',
              badge: <Text>Example badge</Text>,
              highlight: true,
              button: <Button label="Select tier one" onPress={select} />,
            },
            { id: 'two', title: 'Example tier two' },
          ]}
          sections={[
            {
              id: 'group',
              title: 'Feature group',
              features: [
                {
                  id: 'boolean',
                  title: 'Example availability',
                  tiers: { one: true, two: false },
                },
                {
                  id: 'text',
                  title: 'Example labels',
                  tiers: { one: 'Explicit text', two: 2 },
                },
              ],
            },
          ]}
        />
      </ReacdProvider>,
    );
    const table = screen.getByRole('table', { name: 'Illustrative comparison' });
    expect(
      within(table).getByRole('rowheader', { name: 'Example availability' }),
    ).toBeVisible();
    expect(within(table).getByRole('cell', { name: 'Included' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: 'Not included' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: '2' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Select tier one' }));
    expect(select).toHaveBeenCalledOnce();
    expect(pricingValue(undefined)).toBe('Not provided');
  });

  it('preserves controlled field identity when emphasis and orientation change', () => {
    const field = (
      <Input label="Pricing draft" value="Retained" onValueChange={vi.fn()} />
    );
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PricingPlan>{field}</PricingPlan>
      </ReacdProvider>,
    );
    const input = screen.getByRole('textbox');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <PricingPlan orientation="horizontal" highlight scale>
          {field}
        </PricingPlan>
      </ReacdProvider>,
    );
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveValue('Retained');
  });
});
