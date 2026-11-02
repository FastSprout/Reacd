import { expect, it, vi } from 'vitest';
import {
  navigationTargetSchema,
  navigationTransportTargetSchema,
  uniqueNavigationKeys,
} from './target.schema.js';

const identity = { key: 'reference', label: 'Reference' };

it('separates native callback targets from safe link targets', () => {
  const onPress = vi.fn<() => void>();
  expect(navigationTargetSchema.parse({ ...identity, onPress }).onPress).toBe(onPress);
  expect(onPress).not.toHaveBeenCalled();
  expect(navigationTargetSchema.safeParse(identity).success).toBe(true);
  expect(
    navigationTargetSchema.safeParse({
      ...identity,
      href: '/guide',
      newWindow: true,
    }).success,
  ).toBe(true);
  expect(
    navigationTargetSchema.safeParse({
      ...identity,
      href: '/guide',
      newWindow: false,
    }).success,
  ).toBe(true);
  expect(
    navigationTargetSchema.safeParse({
      ...identity,
      href: '/guide',
      onPress,
    }).success,
  ).toBe(false);
  expect(
    navigationTargetSchema.safeParse({
      ...identity,
      newWindow: true,
      onPress,
    }).success,
  ).toBe(false);
  expect(
    navigationTargetSchema.safeParse({
      ...identity,
      href: 'javascript:alert(1)',
    }).success,
  ).toBe(false);
});

it('keeps generative action keys unambiguous and rejects executable transport', () => {
  expect(
    navigationTransportTargetSchema.parse({
      ...identity,
      action: 'open.reference',
    }).action,
  ).toBe('open.reference');
  expect(
    navigationTransportTargetSchema.safeParse({
      ...identity,
      href: '/guide',
      action: 'open.reference',
    }).success,
  ).toBe(false);
  expect(
    navigationTransportTargetSchema.safeParse({
      ...identity,
      action: 'open.reference',
      newWindow: true,
    }).success,
  ).toBe(false);
  expect(
    navigationTransportTargetSchema.safeParse({
      ...identity,
      href: '/guide',
      newWindow: true,
    }).success,
  ).toBe(true);
  expect(
    navigationTransportTargetSchema.safeParse({
      ...identity,
      onPress: () => undefined,
    }).success,
  ).toBe(false);
});

it('requires stable unique keys independent of their presentation labels', () => {
  expect(uniqueNavigationKeys([])).toBe(true);
  expect(uniqueNavigationKeys([{ key: 'one' }, { key: 'two' }])).toBe(true);
  expect(uniqueNavigationKeys([{ key: 'one' }, { key: 'one' }])).toBe(false);
});
