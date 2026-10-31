import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/content-toc/content-toc.adapter.js';
import { SharedContentToc } from '../../shared/content-toc/content-toc.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContentTocProps = ComponentProps<typeof SharedContentToc>;
export const ShadcnContentToc: ComponentType<ShadcnContentTocProps> = bindPrimitives(
  SharedContentToc,
  shadcnPrimitives,
  'ShadcnContentToc',
);
