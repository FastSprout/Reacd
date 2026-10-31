import type { ComponentProps, ComponentType } from 'react';
import { SharedModal } from '../../shared/modal/modal.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiModalProps = ComponentProps<typeof SharedModal>;
export const MuiModal: ComponentType<MuiModalProps> = bindPrimitives(
  SharedModal,
  muiPrimitives,
  'MuiModal',
);
