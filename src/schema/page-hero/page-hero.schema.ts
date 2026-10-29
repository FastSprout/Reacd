import { z } from 'zod';
import { pageIntroductionShape, pageRegionShape } from '../shared/page-presentation.js';

export const pageHeroSchema = z.strictObject({
  ...pageIntroductionShape,
  ...pageRegionShape,
});
