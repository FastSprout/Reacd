import { expect, it, vi } from 'vitest';
import { commandSelectSchema } from
  '../../../schema/command-palette/command-palette.schema.js';
import { activateCommand } from './activate-command.js';
import { followHref } from
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js';

vi.mock(
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js',
  () => ({ followHref: vi.fn() }),
);

it('captures action and destination before host selection can mutate them', () => {
  const original = vi.fn();
  const replacement = vi.fn();
  const action = { key: 'draft', label: 'Draft', onPress: original };
  const select = vi.fn(() => {
    action.onPress = replacement;
    return true;
  });
  expect(activateCommand(action, select, false)).toBe('accepted');
  expect(original).toHaveBeenCalledExactlyOnceWith();
  expect(replacement).not.toHaveBeenCalled();
  const link = { key: 'guide', label: 'Guide', href: '/guide/' };
  expect(
    activateCommand(
      link,
      () => {
        link.href = '/changed/';
      },
      false,
    ),
  ).toBe('accepted');
  expect(followHref).toHaveBeenCalledExactlyOnceWith('/guide/');
  expect(activateCommand({ key: 'plain', label: 'Plain', onPress: replacement },
      undefined, false)).toBe(
    'accepted',
  );
});

it('rejects null, protected, disabled, vetoed and invalid requests', async () => {
  const press = vi.fn();
  const item = { key: 'work', label: 'Work', onPress: press };
  expect(activateCommand(null, undefined, false)).toBe('ignored');
  expect(activateCommand(item, undefined, true)).toBe('ignored');
  expect(activateCommand({ ...item, disabled: true }, undefined, false)).toBe(
    'ignored',
  );
  expect(activateCommand(item, () => false, false)).toBe('ignored');
  for (const invalid of [
    () => {
      throw new Error('Unavailable');
    },
    commandSelectSchema.parse(() => 'invalid'),
    commandSelectSchema.parse(() => null),
    commandSelectSchema.parse(async () => true),
    commandSelectSchema.parse(async () => {
      throw new Error('Async failure');
    }),
  ])
    expect(activateCommand(item, invalid, false)).toBe('invalid');
  await Promise.resolve();
  expect(press).not.toHaveBeenCalled();
});
