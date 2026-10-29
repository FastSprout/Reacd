import type { ReactNode } from 'react';
import type { ContentSearchButtonProps } from './content-search-button.props.js';
import { contentSearchButtonSchema } from '../../schema/content-search-button/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ContentSearchButton(props: ContentSearchButtonProps): ReactNode {
  return useDeclaration('ContentSearchButton', contentSearchButtonSchema, props);
}
