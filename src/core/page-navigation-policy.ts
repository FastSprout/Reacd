import { LAYOUT_POLICY } from './policy.js';
import { PAGE_COMPOSITION_POLICY } from './page-composition-policy.js';

export const PAGE_LINK_DEFAULTS = {
  links: [],
  newWindow: false,
} as const;

export const PAGE_FRAME_POLICY = {
  sideTrackRem: PAGE_COMPOSITION_POLICY.columnTrackRem,
  bodyTrackRem: LAYOUT_POLICY.splitTrackRem,
  sideGrow: 1,
  bodyGrow: 3,
  anchorTabIndex: -1,
} as const;

export const PAGE_CTA_VARIANTS = [
  'solid',
  'outline',
  'soft',
  'subtle',
  'naked',
] as const;
