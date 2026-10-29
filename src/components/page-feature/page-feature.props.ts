import type { z }
  from 'zod';
import type { pageFeatureSchema }
  from '../../schema/page-feature/page-feature.schema.js';

export type PageFeatureProps = z.infer<typeof pageFeatureSchema>;
