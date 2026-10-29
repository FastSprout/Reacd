import { expect, it } from 'vitest';
import { EDITORIAL_POLICY } from '../../core/editorial-policy.js';
import { editorialVariables } from './editorial-variables.js';

it('reserves image geometry and indicator dimensions from core policies', () => {
  const { imageWidth, imageHeight } = EDITORIAL_POLICY;
  expect(editorialVariables()).toEqual({
    '--reacd-editorial-image-ratio': `${imageWidth} / ${imageHeight}`,
    '--reacd-editorial-indicator': `${EDITORIAL_POLICY.indicatorRem}rem`,
  });
});
