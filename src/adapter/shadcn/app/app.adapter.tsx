import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/app/app.adapter.js';
import { SharedApp } from '../../shared/app/app.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAppProps = ComponentProps<typeof SharedApp>;
export const ShadcnApp: ComponentType<ShadcnAppProps> = bindPrimitives(
  SharedApp,
  shadcnPrimitives,
  'ShadcnApp',
);
