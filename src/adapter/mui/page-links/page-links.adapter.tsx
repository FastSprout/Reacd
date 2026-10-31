import type { ComponentProps, ComponentType } from 'react';
import { SharedPageLinks } from '../../shared/page-links/page-links.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageLinksProps = ComponentProps<typeof SharedPageLinks>;
export const MuiPageLinks: ComponentType<MuiPageLinksProps> = bindPrimitives(
  SharedPageLinks,
  muiPrimitives,
  'MuiPageLinks',
);
