import type { ReactNode } from 'react';
import type { ImageProps } from './image.props.js';
import { imageSchema } from '../../schema/image/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Image(props: ImageProps): ReactNode {
  return useDeclaration('Image', imageSchema, props);
}
