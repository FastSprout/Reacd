import { CONTENT_POLICY, DOCUMENT_POLICY } from './policy.js';

export const PRICING_VARIANTS = ['solid', 'outline', 'soft', 'subtle'] as const;
export const PRICING_DEFAULTS = {
  orientation: 'vertical',
  collectionOrientation: 'horizontal',
  variant: 'outline',
  highlight: false,
  scale: false,
  compact: false,
  entries: [],
  featureHeader: 'Feature',
  included: 'Included',
  excluded: 'Not included',
  unavailable: 'Not provided',
} as const;

export const PRICING_POLICY = {
  minimumTiers: 1,
  maximumTiers: CONTENT_POLICY.maxTableColumns - 1,
  maximumSections: 20,
  maximumFeatures: DOCUMENT_POLICY.maxChildren,
  prominenceRatio: 1.25,
} as const;
