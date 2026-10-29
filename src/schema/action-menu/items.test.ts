import { expect, it, vi } from 'vitest';
import { ACTION_MENU_POLICY } from '../../core/action-menu-policy.js';
import { menuItemSchema, menuItemsSchema, menuOptionsSchema } from './items.schema.js';
import { menuNodeItemsSchema } from './generative.schema.js';
import { menuItemActions, menuItemBindings } from './bindings.js';
it('bounds allocation and rejects callback, radio and nesting errors', () => {
  const action = { type: 'action', key: 'run', label: 'Run', onPress: vi.fn() };
  for (const property of ['onPress', 'onCheckedChange', 'onValueChange']) {
    const item =
      property === 'onPress'
        ? action
        : property === 'onCheckedChange'
          ? {
              type: 'checkbox',
              key: 'check',
              label: 'Check',
              checked: false,
              onCheckedChange: vi.fn(),
            }
          : {
              type: 'radio',
              key: 'radio',
              label: 'Radio',
              value: 'one',
              options: [{ value: 'one', label: 'One' }],
              onValueChange: vi.fn(),
            };
    expect(menuItemSchema.safeParse({ ...item, [property]: 'invalid' }).success).toBe(
      false,
    );
  }
  expect(
    menuOptionsSchema.safeParse([
      { value: 'one', label: 'One' },
      { value: 'one', label: 'Repeated' },
    ]).success,
  ).toBe(false);
  const children = Array.from(
    { length: ACTION_MENU_POLICY.maximumSubmenuItems },
    (_, index) => ({ ...action, key: `child-${index}` }),
  );
  const groups = Array.from({ length: 5 }, (_, index) => ({
    type: 'submenu',
    key: `group-${index}`,
    label: 'Group',
    items: children.map((item) => ({ ...item, key: `${index}-${item.key}` })),
  }));
  expect(menuItemsSchema.safeParse(groups).success).toBe(false);
  expect(
    menuNodeItemsSchema.safeParse([
      {
        type: 'submenu',
        key: 'sub',
        label: 'Sub',
        items: [{ type: 'submenu', key: 'nested', label: 'Nested', items: [] }],
      },
    ]).success,
  ).toBe(false);
});
it('collects nested choice bindings and exact action paths', () => {
  const items = menuNodeItemsSchema.parse([
    {
      type: 'submenu',
      key: 'more',
      label: 'More',
      items: [
        { type: 'action', key: 'run', label: 'Run', action: 'run' },
        {
          type: 'checkbox',
          key: 'check',
          label: 'Check',
          checked: {
            state: 'pin',
            mode: 'read',
          },
        },
        {
          type: 'radio',
          key: 'mode',
          label: 'Mode',
          value: {
            state: 'mode',
            mode: 'readWrite',
          },
          options: [{ value: 'one', label: 'One' }],
        },
      ],
    },
  ]);
  const bindings = menuItemBindings(items);
  expect(bindings.map((item) => item.property)).toEqual([
    'items[0].items[1].checked',
    'items[0].items[2].value',
  ]);
  const radio = bindings[1];
  expect(radio?.schema.safeParse('one').success).toBe(true);
  expect(radio?.schema.safeParse('absent').success).toBe(false);
  expect(menuItemActions(items)).toEqual([
    { action: 'run', property: 'items[0].items[0].action' },
  ]);
});
