import { MARQUEE_POLICY } from '../../core/marquee-policy.js';
export function marqueeVariables() {
  return {
    '--reacd-marquee-slow': `${MARQUEE_POLICY.durationsSeconds.slow}s`,
    '--reacd-marquee-normal': `${MARQUEE_POLICY.durationsSeconds.normal}s`,
    '--reacd-marquee-fast': `${MARQUEE_POLICY.durationsSeconds.fast}s`,
    '--reacd-marquee-shift': `-${MARQUEE_POLICY.travelPercent}%`,
    '--reacd-marquee-item-width': `${MARQUEE_POLICY.itemWidthRem}rem`,
  };
}
