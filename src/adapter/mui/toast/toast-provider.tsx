import type { ComponentProps, ComponentType } from 'react';
import { SharedToastProvider } from '../../shared/toast/toast-provider.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiToastProviderProps = ComponentProps<typeof SharedToastProvider>;
export const MuiToastProvider: ComponentType<MuiToastProviderProps> = bindPrimitives(
  SharedToastProvider,
  muiPrimitives,
  'MuiToastProvider',
);
