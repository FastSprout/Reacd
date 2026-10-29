import type { z } from 'zod';
import type { modalSchema } from '../../schema/modal/modal.schema.js';
export type ModalProps = z.infer<typeof modalSchema>;
