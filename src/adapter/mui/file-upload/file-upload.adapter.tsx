import type { ComponentProps, ComponentType } from 'react';
import { SharedFileUpload } from '../../shared/file-upload/file-upload.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiFileUploadProps = ComponentProps<typeof SharedFileUpload>;
export const MuiFileUpload: ComponentType<MuiFileUploadProps> = bindPrimitives(
  SharedFileUpload,
  muiPrimitives,
  'MuiFileUpload',
);
