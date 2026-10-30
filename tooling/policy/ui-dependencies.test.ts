import { describe, expect, it } from 'vitest';
import { isTrustedUiDependency } from './ui-dependencies.js';

const INTEGRATIONS = [
  '@radix-ui/react-label',
  '@base-ui/react',
  '@base-ui/utils',
  '@tiptap/react',
  '@react-aria/button',
  '@react-stately/collections',
  '@tailwindcss/vite',
  '@daypicker/react',
  'react-aria-components',
  'react-dom',
  'lucide-react',
  'input-otp',
  'clsx',
  'class-variance-authority',
  'tailwind-merge',
  'tailwindcss',
];

const BUSINESS_IMPORTS = [
  'react',
  'jotai',
  'jotai/utils',
  '@fastsprout/reacd',
  '@fastsprout/reacd/generative',
  'zod',
  '@internationalized/date',
  './business/react-label.js',
  '@radix-ui-business/react-label',
  '@base-ui-business/react',
  '@tiptap-business/react',
  '@react-aria-business/button',
  '@react-stately-business/state',
  '@tailwindcss-business/math',
  '@daypicker/react-calendar',
  'react-aria-components-business',
  'react-dom-business',
  'lucide-react-business',
  'input-otp-business',
  'clsx-business',
  'class-variance-authority-business',
  'tailwind-merge-business',
  'tailwindcss-business',
];

describe('trusted UI integration dependencies', () => {
  it.each(INTEGRATIONS)('identifies package and subpaths: %s', (value) => {
    expect(isTrustedUiDependency(value)).toBe(true);
    expect(isTrustedUiDependency(`${value}/private-entry`)).toBe(true);
  });

  it.each(BUSINESS_IMPORTS)('preserves unrelated business paths: %s', (value) => {
    expect(isTrustedUiDependency(value)).toBe(false);
  });
});
