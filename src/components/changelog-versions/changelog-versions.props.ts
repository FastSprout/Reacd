import type { z } from 'zod';
import type { changelogVersionsSchema }
  from '../../schema/changelog-versions/changelog-versions.schema.js';

export type ChangelogVersionsProps = z.infer<typeof changelogVersionsSchema>;
