import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/radio-group/radio-group.adapter.js';
import { SharedRadioGroup } from '../../shared/radio-group/radio-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnRadioGroupProps = ComponentProps<typeof SharedRadioGroup>;
export const ShadcnRadioGroup: ComponentType<ShadcnRadioGroupProps> = bindPrimitives(
  SharedRadioGroup,
  shadcnPrimitives,
  'ShadcnRadioGroup',
);
