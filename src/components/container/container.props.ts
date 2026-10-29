import type { z } from 'zod';
import type { containerSchema } from '../../schema/container/container.schema.js';

export type ContainerProps = z.infer<typeof containerSchema>;
