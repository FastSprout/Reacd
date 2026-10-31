import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/footer/footer.adapter.js';
import { SharedFooter } from '../../shared/footer/footer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnFooterProps = ComponentProps<typeof SharedFooter>;
export const ShadcnFooter: ComponentType<ShadcnFooterProps> = bindPrimitives(
  SharedFooter,
  shadcnPrimitives,
  'ShadcnFooter',
);
