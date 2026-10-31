import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/listbox/listbox.adapter.js';
import { SharedListbox } from '../../shared/listbox/listbox.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnListboxProps = ComponentProps<typeof SharedListbox>;
export const ShadcnListbox: ComponentType<ShadcnListboxProps> = bindPrimitives(
  SharedListbox,
  shadcnPrimitives,
  'ShadcnListbox',
);
