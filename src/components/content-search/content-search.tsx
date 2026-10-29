import type { ReactNode } from 'react';
import type { ContentSearchProps } from './content-search.props.js';
import { contentSearchSchema } from '../../schema/content-search/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ContentSearch(props: ContentSearchProps): ReactNode {
  return useDeclaration('ContentSearch', contentSearchSchema, props);
}
