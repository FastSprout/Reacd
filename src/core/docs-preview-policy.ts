import { DESIGN_POLICY } from './policy.js';

export const DOCS_PREVIEW_POLICY = {
  frameHeight: 560,
  maximumQueryLength: 256,
  defaultTemplate: DESIGN_POLICY.defaultTemplate,
  defaultDirection: 'ltr',
  publicAssets: [
    'avatar-placeholder.svg',
    'avatar-unavailable.svg',
    'color-mode-light.svg',
    'color-mode-dark.svg',
  ],
} as const;
