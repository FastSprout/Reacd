import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/toast/toast-provider.js';
import { SharedToastProvider } from '../../shared/toast/toast-provider.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnToastProviderProps = ComponentProps<typeof SharedToastProvider>;
export const ShadcnToastProvider: ComponentType<ShadcnToastProviderProps> =
  bindPrimitives(SharedToastProvider, shadcnPrimitives, 'ShadcnToastProvider');
