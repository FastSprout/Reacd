import type { z } from 'zod';
import type { stepperSchema } from '../../schema/stepper/stepper.schema.js';
export type StepperProps = z.infer<typeof stepperSchema>;
