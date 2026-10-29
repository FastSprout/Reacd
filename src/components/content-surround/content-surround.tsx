import type { ReactNode } from 'react';
import type { ContentSurroundProps } from './content-surround.props.js';
import { contentSurroundSchema } from '../../schema/content-surround/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ContentSurround(props: ContentSurroundProps): ReactNode {
  return useDeclaration('ContentSurround', contentSurroundSchema, props);
}
