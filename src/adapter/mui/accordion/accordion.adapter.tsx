import type { ComponentProps, ComponentType } from 'react';
import { SharedAccordion } from '../../shared/accordion/accordion.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiAccordionProps = ComponentProps<typeof SharedAccordion>;
export const MuiAccordion: ComponentType<MuiAccordionProps> = bindPrimitives(
  SharedAccordion,
  muiPrimitives,
  'MuiAccordion',
);
