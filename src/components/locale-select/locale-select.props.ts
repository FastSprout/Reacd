import type { z } from 'zod';
import type { localeSelectSchema } from '../../schema/locale-select/index.js';

export type LocaleSelectProps = z.infer<typeof localeSelectSchema>;
