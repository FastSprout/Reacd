import type { ComponentProps, ComponentType } from 'react';
import { SharedError } from '../../shared/error/error.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiErrorProps = ComponentProps<typeof SharedError>;
export const MuiError: ComponentType<MuiErrorProps> = bindPrimitives(
  SharedError,
  muiPrimitives,
  'MuiError',
);
