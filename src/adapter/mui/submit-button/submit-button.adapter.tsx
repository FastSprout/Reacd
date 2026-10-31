import type { ComponentProps, ComponentType } from 'react';
import { SharedSubmitButton } from
  '../../shared/submit-button/submit-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSubmitButtonProps = ComponentProps<typeof SharedSubmitButton>;
export const MuiSubmitButton: ComponentType<MuiSubmitButtonProps> = bindPrimitives(
  SharedSubmitButton,
  muiPrimitives,
  'MuiSubmitButton',
);
