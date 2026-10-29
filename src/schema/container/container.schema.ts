import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const containerSchema = z.strictObject({ children: childrenSchema });
