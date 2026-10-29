import { CONTENT_POLICY } from './policy.js';
export const COLOR_MODES = ['rgb', 'rgba'] as const;
export const COLOR_PICKER_POLICY = {
  maxPresets: CONTENT_POLICY.maxOptions,
  rgbLength: 7,
  rgbaLength: 9,
  areaHeightRem: 8,
  trackHeightRem: 1.5,
  thumbRem: 1.5,
  thumbOutlinePx: 2,
  thumbShadowPx: 1,
  thumbLight: '#ffffff',
  thumbDark: '#000000',
  ltrLocale: 'en-US',
  rtlLocale: 'en-Arab-US-u-nu-latn',
  invalidHex: 'Enter a complete hexadecimal color matching the selected mode.',
} as const;
export const COLOR_HEX_PATTERNS = {
  rgb: '#[0-9a-fA-F]{6}',
  rgba: '#[0-9a-fA-F]{8}',
} as const;
