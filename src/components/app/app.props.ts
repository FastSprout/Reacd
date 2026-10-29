import type { z } from 'zod';
import type { appSchema } from '../../schema/app/app.schema.js';

export type AppProps = z.infer<typeof appSchema>;
