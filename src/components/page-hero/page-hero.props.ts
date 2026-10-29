import type { z } from 'zod';
import type { pageHeroSchema } from '../../schema/page-hero/page-hero.schema.js';

export type PageHeroProps = z.infer<typeof pageHeroSchema>;
