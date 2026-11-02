import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('configures active drawer portals for official iOS backdrop layout', () => {
  const css = readFileSync('src/adapter/shadcn/drawer/drawer-layout.css', 'utf8');
  expect(css).toContain('@supports (-webkit-touch-callout: none)');
  expect(css).toContain('body:has(.reacd-native-drawer-portal)');
  expect(css).toContain('position: relative');
});
