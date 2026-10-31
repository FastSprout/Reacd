import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/popover/popover.adapter.js';
import { SharedPopover } from '../../shared/popover/popover.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPopoverProps = ComponentProps<typeof SharedPopover>;
export const ShadcnPopover: ComponentType<ShadcnPopoverProps> = bindPrimitives(
  SharedPopover,
  shadcnPrimitives,
  'ShadcnPopover',
);
