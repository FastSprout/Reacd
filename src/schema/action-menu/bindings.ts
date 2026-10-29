import { z } from 'zod';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import type { MenuNodeItems } from './generative.schema.js';
export function menuItemBindings(items: MenuNodeItems): BindingContract[] {
  return items.flatMap((item, index): BindingContract[] => {
    const path = `items[${index}]`;
    switch (item.type) {
      case 'submenu':
        return menuItemBindings(item.items).map((contract) => ({
          ...contract,
          property: `${path}.${contract.property}`,
        }));
      case 'checkbox':
        return [
          {
            reference: item.checked,
            property: `${path}.checked`,
            kinds: ['boolean'],
            mode: item.checked.mode,
            schema: z.boolean(),
          },
        ];
      case 'radio':
        return [
          {
            reference: item.value,
            property: `${path}.value`,
            kinds: ['text'],
            mode: item.value.mode,
            schema: z
              .string()
              .refine(
                (value) => item.options.some((option) => option.value === value),
                'Selected radio value must identify an option.',
              ),
          },
        ];
      default:
        return [];
    }
  });
}
export function menuItemActions(items: MenuNodeItems): {
  action: string;
  property: string;
}[] {
  return items.flatMap((item, index) => {
    if (item.type === 'submenu')
      return menuItemActions(item.items).map((reference) => ({
        ...reference,
        property: `items[${index}].${reference.property}`,
      }));
    return item.type === 'action'
      ? [{ action: item.action, property: `items[${index}].action` }]
      : [];
  });
}
