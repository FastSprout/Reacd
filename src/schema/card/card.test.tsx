import { expect, it } from 'vitest';
import { Text } from '../../components/text/text.js';
import { cardSchema } from './card.schema.js';

it('accepts validated content in every card slot and rejects native escapes', () => {
  expect(cardSchema.safeParse({ children: <Text>Body</Text> }).success).toBe(true);
  expect(
    cardSchema.safeParse({
      label: 'Delivery',
      header: <Text>Header</Text>,
      children: <Text>Body</Text>,
      footer: <Text>Footer</Text>,
      spacing: 'large',
    }).success,
  ).toBe(true);
  for (const change of [
    { header: <div>Native</div> },
    { footer: <span>Native</span> },
    { children: <section>Native</section> },
    { style: {} },
    { className: 'card' },
    { render: () => 'arbitrary' },
    { onClick: () => undefined },
    { label: '' },
  ])
    expect(cardSchema.safeParse(change).success).toBe(false);
});
