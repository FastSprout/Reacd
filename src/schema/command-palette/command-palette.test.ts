import { describe, expect, it, vi } from 'vitest';
import { commandPaletteSchema } from './command-palette.schema.js';
import { COMMAND_POLICY } from '../../core/command-policy.js';

const item = { key: 'guide', label: 'Guide', href: '/guide' };
const groups = [{ key: 'docs', label: 'Documentation', items: [item] }];
const props = { label: 'Search commands', query: '', onQueryChange: vi.fn(), groups };

describe('CommandPalette contract', () => {
  it('enforces total item and query budgets for untrusted declarations', () => {
    const groupCount =
      Math.floor(
        COMMAND_POLICY.maximumTotalItems / COMMAND_POLICY.maximumItemsPerGroup,
      ) + 1;
    const overflow = Array.from({ length: groupCount }, (_, group) => ({
      key: `group-${group}`,
      label: 'Group',
      items: Array.from(
        { length: COMMAND_POLICY.maximumItemsPerGroup },
        (_, index) => ({
          key: `command-${group}-${index}`,
          label: 'Command',
          href: '/',
        }),
      ),
    }));
    expect(commandPaletteSchema.safeParse({ ...props, groups: overflow }).success).toBe(
      false,
    );
    expect(
      commandPaletteSchema.safeParse({
        ...props,
        query: 'x'.repeat(COMMAND_POLICY.maximumQueryLength + 1),
      }).success,
    ).toBe(false);
    expect(commandPaletteSchema.safeParse({ ...props, onSelect: 42 }).success).toBe(
      false,
    );
  });
  it('accepts safe targets or an explicit selection handler', () => {
    expect(commandPaletteSchema.safeParse(props).success).toBe(true);
    expect(
      commandPaletteSchema.safeParse({
        ...props,
        groups: [
          {
            key: 'tasks',
            label: 'Tasks',
            items: [{ key: 'one', label: 'One' }],
          },
        ],
        onSelect: vi.fn(),
      }).success,
    ).toBe(true);
    expect(commandPaletteSchema.safeParse({ ...props, groups: [] }).success).toBe(true);
  });
  it('rejects no-op actions, global key collisions and unsafe targets', () => {
    for (const invalid of [
      {
        ...props,
        groups: [
          { key: 'docs', label: 'Docs', items: [{ key: 'none', label: 'No action' }] },
        ],
      },
      { ...props, groups: [...groups, { ...groups[0], key: 'other' }] },
      { ...props, groups: [groups[0], groups[0]] },
      {
        ...props,
        groups: [
          { key: 'docs', label: 'Docs', items: [{ ...item, onPress: vi.fn() }] },
        ],
      },
      {
        ...props,
        groups: [
          {
            key: 'docs',
            label: 'Docs',
            items: [{ ...item, href: '//outside.invalid' }],
          },
        ],
      },
      { ...props, style: { display: 'none' } },
    ])
      expect(commandPaletteSchema.safeParse(invalid).success).toBe(false);
  });
});
