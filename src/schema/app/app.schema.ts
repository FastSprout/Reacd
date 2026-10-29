import { z } from 'zod';
import {
  APPLICATION_DIRECTIONS,
  APPLICATION_POLICY,
} from '../../core/application-shell-policy.js';
import { childrenSchema } from '../shared/children.js';

export const appSchema = z.strictObject({
  children: childrenSchema,
  direction: z.enum(APPLICATION_DIRECTIONS).optional(),
  language: z
    .string()
    .min(1)
    .max(APPLICATION_POLICY.maximumLanguageLength)
    .regex(/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/)
    .optional(),
});
