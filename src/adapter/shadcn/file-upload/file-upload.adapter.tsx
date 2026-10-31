import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/file-upload/file-upload.adapter.js';
import { SharedFileUpload } from '../../shared/file-upload/file-upload.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnFileUploadProps = ComponentProps<typeof SharedFileUpload>;
export const ShadcnFileUpload: ComponentType<ShadcnFileUploadProps> = bindPrimitives(
  SharedFileUpload,
  shadcnPrimitives,
  'ShadcnFileUpload',
);
