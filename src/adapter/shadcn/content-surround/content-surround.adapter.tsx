import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/content-surround/content-surround.adapter.js';
import { SharedContentSurround } from
  '../../shared/content-surround/content-surround.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContentSurroundProps = ComponentProps<typeof SharedContentSurround>;
export const ShadcnContentSurround: ComponentType<ShadcnContentSurroundProps> =
  bindPrimitives(SharedContentSurround, shadcnPrimitives, 'ShadcnContentSurround');
