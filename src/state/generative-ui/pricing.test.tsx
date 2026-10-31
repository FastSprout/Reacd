import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';

const action = () =>
  ({ type: 'Button', label: 'Pricing slot action', action: 'run' }) as const;
const plan = () => ({
  title: 'Illustrative generated plan',
  price: 'Example price',
  children: [action()],
  badge: [action()],
  button: [action()],
  header: [action()],
  footer: [action()],
  features: [
    'Plain feature',
    { key: 'leading', title: 'Keyed feature', leading: [action()] },
  ],
});
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'VStack',
    children: [
      { ...plan(), type: 'PricingPlan' },
      { type: 'PricingPlan', children: [] },
      {
        type: 'PricingPlan',
        features: [{ key: 'plain', title: 'Plain keyed feature' }],
        children: [],
      },
      { type: 'PricingPlans', plans: [{ ...plan(), key: 'generated' }], children: [] },
      { type: 'PricingPlans', children: [] },
      {
        type: 'PricingTable',
        caption: 'Generated comparison',
        tiers: [
          { id: 'one', title: 'Example tier', badge: [action()], button: [action()] },
          { id: 'two', title: 'Another tier' },
        ],
        sections: [
          {
            id: 'access',
            title: 'Access',
            features: [
              {
                id: 'availability',
                title: 'Example inclusion',
                tiers: { one: true, two: false },
              },
            ],
          },
        ],
      },
    ],
  },
});

describe('generative pricing', () => {
  it('resolves plan, feature, collection and tier slot actions', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(
      <GenerativeUI adapter={shadcnAdapter} document={declaration} actions={{ run }} />,
    );
    for (const button of screen.getAllByRole('button')) await user.click(button);
    expect(run).toHaveBeenCalledTimes(screen.getAllByRole('button').length);
    expect(
      renderToString(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          actions={{ run }}
        />,
      ),
    ).toContain('Generated comparison');
  });

  it('validates all feature/tier/plan actions before exposing controls', () => {
    for (const root of [
      ...['children', 'badge', 'button', 'header', 'footer'].map((slot) => ({
        type: 'PricingPlan',
        children: [],
        [slot]: [action()],
      })),
      {
        type: 'PricingPlan',
        children: [],
        features: [{ key: 'one', title: 'Feature', leading: [action()] }],
      },
      { type: 'PricingPlans', plans: [{ ...plan(), key: 'one' }], children: [] },
      ...['badge', 'button'].map((slot) => ({
        type: 'PricingTable',
        caption: 'Comparison',
        tiers: [{ id: 'one', title: 'Tier', [slot]: [action()] }],
        sections: [],
      })),
    ]) {
      const view = render(
        <GenerativeUI adapter={shadcnAdapter} document={{ ...declaration, root }} />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      view.unmount();
    }
  });

  it('rejects incomplete comparison and invalid plan metadata in JSON', () => {
    for (const root of [
      { type: 'PricingPlan', children: [], discount: 'Missing original' },
      {
        type: 'PricingPlans',
        plans: [
          { key: 'same', children: [] },
          { key: 'same', children: [] },
        ],
        children: [],
      },
      {
        type: 'PricingTable',
        caption: 'Invalid comparison',
        tiers: [{ id: 'one', title: 'One' }],
        sections: [
          {
            id: 'group',
            title: 'Group',
            features: [{ id: 'feature', title: 'Feature', tiers: {} }],
          },
        ],
      },
    ])
      expect(validateGenerativeDocument({ ...declaration, root }).success).toBe(false);
  });
});
