import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const mainSchema = z.strictObject({ children: childrenSchema });
