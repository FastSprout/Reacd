import type { z } from 'zod';
import type { accordionSchema } from '../../schema/accordion/accordion.schema.js';
export type AccordionProps = z.infer<typeof accordionSchema>;
