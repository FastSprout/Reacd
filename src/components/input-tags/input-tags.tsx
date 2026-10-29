import type { ReactNode } from 'react';
import { inputTagsSchema } from '../../schema/input-tags/index.js';
import type { InputTagsProps } from './input-tags.props.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { InputTagsProps } from './input-tags.props.js';
export function InputTags(props: InputTagsProps): ReactNode {
  return useDeclaration('InputTags', inputTagsSchema, props);
}
