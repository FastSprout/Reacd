import type { z } from 'zod';
import type { changelogVersionSchema }
  from '../../schema/changelog-version/changelog-version.schema.js';

export type ChangelogVersionProps = z.infer<typeof changelogVersionSchema>;
