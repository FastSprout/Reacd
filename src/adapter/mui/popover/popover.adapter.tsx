import type { ComponentProps, ComponentType } from 'react';
import { SharedPopover } from '../../shared/popover/popover.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPopoverProps = ComponentProps<typeof SharedPopover>;
export const MuiPopover: ComponentType<MuiPopoverProps> = bindPrimitives(
  SharedPopover,
  muiPrimitives,
  'MuiPopover',
);
