import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/modal/modal.adapter.js';
import { SharedModal } from '../../shared/modal/modal.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnModalProps = ComponentProps<typeof SharedModal>;
export const ShadcnModal: ComponentType<ShadcnModalProps> = bindPrimitives(
  SharedModal,
  shadcnPrimitives,
  'ShadcnModal',
);
