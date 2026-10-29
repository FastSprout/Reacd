import { describe, expect, it, vi } from 'vitest';
import { dropdownMenuSchema } from './dropdown-menu.schema.js';
const base = { label: 'Record actions', open: false, onOpenChange: vi.fn() };
const action = { type: 'action', key: 'run', label: 'Run', onPress: vi.fn() };
describe('closed dropdown declarations', () => {
  it('accepts actions, safe links and controlled choices', () => {
    expect(
      dropdownMenuSchema.safeParse({
        ...base,
        items: [
          action,
          { type: 'link', key: 'home', label: 'Home', href: '/' },
          {
            type: 'checkbox',
            key: 'flag',
            label: 'Flag',
            checked: false,
            onCheckedChange: vi.fn(),
          },
          {
            type: 'radio',
            key: 'mode',
            label: 'Mode',
            value: 'one',
            onValueChange: vi.fn(),
            options: [{ value: 'one', label: 'One' }],
          },
        ],
      }).success,
    ).toBe(true);
  });
  it('rejects invalid styles, keys, targets and choices', () => {
    for (const items of [
      [action, action],
      [{ type: 'link', key: 'bad', label: 'Bad', href: 'javascript:bad()' }],
      [{ type: 'action', key: 'empty', label: 'No callback' }],
      [
        {
          type: 'radio',
          key: 'mode',
          label: 'Mode',
          value: 'missing',
          onValueChange: vi.fn(),
          options: [{ value: 'one', label: 'One' }],
        },
      ],
      [{ type: 'submenu', key: 'sub', label: 'More', items: [action] }, action],
    ])
      expect(dropdownMenuSchema.safeParse({ ...base, items }).success).toBe(false);
    expect(
      dropdownMenuSchema.safeParse({ ...base, items: [action], style: {} }).success,
    ).toBe(false);
  });
});
