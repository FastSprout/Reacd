import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/textarea/textarea.adapter.js';
import { SharedTextarea } from '../../shared/textarea/textarea.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTextareaProps = ComponentProps<typeof SharedTextarea>;
export const ShadcnTextarea: ComponentType<ShadcnTextareaProps> = bindPrimitives(
  SharedTextarea,
  shadcnPrimitives,
  'ShadcnTextarea',
);
