import { LAYOUT_POLICY } from './policy.js';

export const FOCUS_REVEAL_POLICY = {
  behavior: 'instant',
  clearance: LAYOUT_POLICY.focusOutlinePx,
  keyStep: LAYOUT_POLICY.controlTargetPx,
} as const;
