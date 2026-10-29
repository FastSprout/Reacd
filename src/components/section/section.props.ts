import type { z } from 'zod';
import type { sectionSchema } from '../../schema/section/section.schema.js';

export type SectionProps = z.infer<typeof sectionSchema>;
