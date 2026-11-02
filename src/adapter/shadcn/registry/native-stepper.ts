import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { stepperSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/stepper/stepper.schema.js';
import { ShadcnStepper } from '../stepper/stepper.adapter.js';

export const nativeStepperEntries = {
  Stepper: renderEntry('Stepper', stepperSchema, ShadcnStepper),
};
