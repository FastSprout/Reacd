import type { ComponentProps, ComponentType } from 'react';
import { SharedPageSection } from '../../shared/page-section/page-section.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageSectionProps = ComponentProps<typeof SharedPageSection>;
export const MuiPageSection: ComponentType<MuiPageSectionProps> = bindPrimitives(
  SharedPageSection,
  muiPrimitives,
  'MuiPageSection',
);
