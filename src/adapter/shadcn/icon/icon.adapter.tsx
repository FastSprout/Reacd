import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/icon/icon.adapter.js';
import { SharedIcon } from '../../shared/icon/icon.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnIconProps = ComponentProps<typeof SharedIcon>;
export const ShadcnIcon: ComponentType<ShadcnIconProps> = bindPrimitives(
  SharedIcon,
  shadcnPrimitives,
  'ShadcnIcon',
);
