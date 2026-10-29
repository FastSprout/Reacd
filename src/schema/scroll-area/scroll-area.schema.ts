import { z } from 'zod';
import {
  SCROLL_AREA_ORIENTATIONS,
  SCROLL_AREA_EXTENTS,
} from '../../core/scroll-area-policy.js';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';
export const scrollAreaSchema = z.strictObject({
  label: labelSchema,
  orientation: z.enum(SCROLL_AREA_ORIENTATIONS).optional(),
  extent: z.enum(SCROLL_AREA_EXTENTS).optional(),
  children: childrenSchema,
});
