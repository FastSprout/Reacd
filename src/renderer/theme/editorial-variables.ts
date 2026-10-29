import { EDITORIAL_POLICY } from '../../core/editorial-policy.js';

export function editorialVariables() {
  const { imageWidth, imageHeight } = EDITORIAL_POLICY;
  return {
    '--reacd-editorial-image-ratio': `${imageWidth} / ${imageHeight}`,
    '--reacd-editorial-indicator': `${EDITORIAL_POLICY.indicatorRem}rem`,
  };
}
