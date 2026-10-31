import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/submit-button/submit-button.adapter.js';
import { SharedSubmitButton } from
  '../../shared/submit-button/submit-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSubmitButtonProps = ComponentProps<typeof SharedSubmitButton>;
export const ShadcnSubmitButton: ComponentType<ShadcnSubmitButtonProps> =
  bindPrimitives(SharedSubmitButton, shadcnPrimitives, 'ShadcnSubmitButton');
