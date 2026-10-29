import { expect, it } from 'vitest';
import {
  consistentColorMode,
  oppositeColorMode,
  resolveColorMode,
} from './color-mode.js';

it('resolves explicit preferences and the host system snapshot', () => {
  expect(resolveColorMode('system', 'dark')).toBe('dark');
  expect(resolveColorMode('system', 'light')).toBe('light');
  expect(resolveColorMode('light', 'dark')).toBe('light');
  expect(resolveColorMode('dark', 'light')).toBe('dark');
  expect(oppositeColorMode('dark')).toBe('light');
  expect(oppositeColorMode('light')).toBe('dark');
  expect(consistentColorMode({ value: 'system', resolvedMode: 'dark' })).toBe(true);
  expect(consistentColorMode({ value: 'dark', resolvedMode: 'dark' })).toBe(true);
  expect(consistentColorMode({ value: 'light', resolvedMode: 'dark' })).toBe(false);
});
