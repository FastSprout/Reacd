import { describe, expect, it, vi } from 'vitest';
import { footerColumnsSchema } from './footer-columns/footer-columns.schema.js';
import { navigationMenuSchema } from './navigation-menu/navigation-menu.schema.js';
import { stepperSchema } from './stepper/stepper.schema.js';
import { Text } from '../components/text/text.js';

const link = { key: 'guide', label: 'Guide', href: '/guide' };
const columns = [{ key: 'docs', label: 'Documentation', children: [link] }];
const steps = [
  { key: 'address', title: 'Address', content: <Text>Address content</Text> },
  { key: 'payment', title: 'Payment' },
];

describe('closed navigation declarations', () => {
  it('accepts keyed columns, slots, groups and controlled steps', () => {
    expect(
      footerColumnsSchema.parse({
        label: 'Footer',
        columns,
        left: <Text>Left</Text>,
        right: <Text>Right</Text>,
      }).columns,
    ).toHaveLength(1);
    expect(
      navigationMenuSchema.parse({
        label: 'Main',
        items: [{ key: 'docs', label: 'Docs', children: [link] }],
      }).items,
    ).toHaveLength(1);
    expect(
      stepperSchema.parse({
        label: 'Checkout',
        items: steps,
        value: 'address',
        onValueChange: vi.fn(),
      }).value,
    ).toBe('address');
  });

  it('rejects ambiguous targets, unsafe URLs and duplicate keys', () => {
    for (const target of [
      { ...link, href: 'javascript:alert(1)' },
      { ...link, onPress: vi.fn() },
      { ...link, href: '/\\external' },
    ]) {
      expect(
        footerColumnsSchema.safeParse({
          label: 'Footer',
          columns: [{ ...columns[0], children: [target] }],
        }).success,
      ).toBe(false);
      expect(
        navigationMenuSchema.safeParse({
          label: 'Main',
          items: [target],
        }).success,
      ).toBe(false);
    }
    expect(
      footerColumnsSchema.safeParse({
        label: 'Footer',
        columns: [columns[0], columns[0]],
      }).success,
    ).toBe(false);
    expect(
      navigationMenuSchema.safeParse({
        label: 'Main',
        items: [link, link],
      }).success,
    ).toBe(false);
    expect(
      stepperSchema.safeParse({
        label: 'Steps',
        value: 'address',
        items: [steps[0], steps[0]],
        onValueChange: vi.fn(),
      }).success,
    ).toBe(false);
  });

  it('rejects unsafe children, invalid active steps and grouping targets', () => {
    expect(
      footerColumnsSchema.safeParse({
        label: 'Footer',
        columns,
        right: <div>Native</div>,
      }).success,
    ).toBe(false);
    expect(
      navigationMenuSchema.safeParse({
        label: 'Main',
        items: [{ ...link, children: [link] }],
      }).success,
    ).toBe(false);
    expect(
      navigationMenuSchema.safeParse({
        label: 'Main',
        items: [{ ...link, description: 'Group descriptions require child links.' }],
      }).success,
    ).toBe(false);
    for (const value of ['missing', 'payment']) {
      expect(
        stepperSchema.safeParse({
          label: 'Steps',
          value,
          items: [steps[0], { ...steps[1], disabled: true }],
          onValueChange: vi.fn(),
        }).success,
      ).toBe(false);
    }
    expect(
      stepperSchema.safeParse({
        label: 'Steps',
        value: 'address',
        items: [{ ...steps[0], content: <p /> }],
        onValueChange: vi.fn(),
      }).success,
    ).toBe(false);
    for (const schema of [footerColumnsSchema, navigationMenuSchema, stepperSchema]) {
      expect(schema.safeParse({ className: 'escape' }).success).toBe(false);
    }
  });
});
