import type { z } from 'zod';
import type { pinInputSchema } from '../../schema/pin-input/pin-input.schema.js';

export type PinInputProps = z.infer<typeof pinInputSchema>;
