import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/accordion/accordion.adapter.js';
import { SharedAccordion } from '../../shared/accordion/accordion.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAccordionProps = ComponentProps<typeof SharedAccordion>;
export const ShadcnAccordion: ComponentType<ShadcnAccordionProps> = bindPrimitives(
  SharedAccordion,
  shadcnPrimitives,
  'ShadcnAccordion',
);
