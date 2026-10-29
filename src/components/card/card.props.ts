import type { z } from 'zod';
import type { cardSchema } from '../../schema/card/card.schema.js';

export type CardProps = z.infer<typeof cardSchema>;
