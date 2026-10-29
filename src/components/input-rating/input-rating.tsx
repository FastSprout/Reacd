import type { ReactNode } from 'react';
import type { InputRatingProps } from './input-rating.props.js';
import { inputRatingSchema } from '../../schema/input-rating/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { InputRatingProps } from './input-rating.props.js';
export function InputRating(props: InputRatingProps): ReactNode {
  return useDeclaration('InputRating', inputRatingSchema, props);
}
