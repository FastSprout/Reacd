import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { PAGINATION_POLICY, PAGINATION_SIZES } from '../../core/pagination-policy.js';
import { labelSchema } from '../shared/values.js';
import { paginationValueSchema } from '../state/pagination/pagination.schema.js';
import { paginationNavigationSchema } from './navigation.schema.js';
import { validPaginationValue } from './value.schema.js';
type PageValue = z.infer<typeof paginationValueSchema>;
export const paginationSchema = z
  .strictObject({
    label: labelSchema,
    totalItems: z.number().int().min(0).max(PAGINATION_POLICY.maximumItems),
    value: paginationValueSchema,
    onValueChange: z
      .custom<(value: PageValue) => boolean | void>(
        (value) => typeof value === 'function',
        FRAMEWORK_ERRORS.invalidCallback,
      )
      .optional(),
    navigation: paginationNavigationSchema.optional(),
    disabled: z.boolean().optional(),
    showControls: z.boolean().optional(),
    showEdges: z.boolean().optional(),
    siblingCount: z
      .number()
      .int()
      .min(0)
      .max(PAGINATION_POLICY.maximumSiblings)
      .optional(),
    size: z.enum(PAGINATION_SIZES).optional(),
  })
  .refine(
    (props) => validPaginationValue(props.totalItems, props.value, props.navigation),
    'Page or navigation target is invalid.',
  );
