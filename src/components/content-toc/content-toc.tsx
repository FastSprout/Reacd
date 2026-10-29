import type { ReactNode } from 'react';
import { contentTocSchema } from '../../schema/content-toc/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { ContentTocProps } from './content-toc.props.js';

export function ContentToc(props: ContentTocProps): ReactNode {
  return useDeclaration('ContentToc', contentTocSchema, props);
}
