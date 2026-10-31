import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/text-area/text-area.adapter.js';
import { SharedTextArea } from '../../shared/text-area/text-area.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTextAreaProps = ComponentProps<typeof SharedTextArea>;
export const ShadcnTextArea: ComponentType<ShadcnTextAreaProps> = bindPrimitives(
  SharedTextArea,
  shadcnPrimitives,
  'ShadcnTextArea',
);
