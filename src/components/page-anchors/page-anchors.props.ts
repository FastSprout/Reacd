import type { z } from 'zod';
import type { pageAnchorsSchema }
  from '../../schema/page-anchors/page-anchors.schema.js';

export type PageAnchorsProps = z.infer<typeof pageAnchorsSchema>;
