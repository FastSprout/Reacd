import type { z }
  from 'zod';
import type { pageSectionSchema }
  from '../../schema/page-section/page-section.schema.js';

export type PageSectionProps = z.infer<typeof pageSectionSchema>;
