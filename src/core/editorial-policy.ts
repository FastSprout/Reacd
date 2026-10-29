export const EDITORIAL_VARIANTS = [
  'outline',
  'soft',
  'subtle',
  'ghost',
  'naked',
] as const;

export const EDITORIAL_DEFAULTS = {
  orientation: 'vertical',
  collectionOrientation: 'horizontal',
  variant: 'outline',
  indicator: true,
  entries: [],
  unavailableImage: MEDIA_DEFAULTS.unavailable,
} as const;

export const EDITORIAL_POLICY = {
  imageWidth: MEDIA_DIMENSIONS.editorial.width,
  imageHeight: MEDIA_DIMENSIONS.editorial.height,
  indicatorRem: 0.5,
} as const;
import { MEDIA_DEFAULTS, MEDIA_DIMENSIONS } from './media-policy.js';
