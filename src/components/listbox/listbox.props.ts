import type { z } from 'zod';
import type { listboxSchema } from '../../schema/listbox/listbox.schema.js';

export type ListboxProps = z.infer<typeof listboxSchema>;
