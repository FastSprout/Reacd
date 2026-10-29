import type { ReactNode } from 'react';
import type { FileUploadProps } from './file-upload.props.js';
import { fileUploadSchema } from '../../schema/file-upload/file-upload.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function FileUpload(props: FileUploadProps): ReactNode {
  return useDeclaration('FileUpload', fileUploadSchema, props);
}
