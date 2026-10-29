import type { ReactNode } from 'react';
import type { CardProps } from './card.props.js';
import { cardSchema } from '../../schema/card/card.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { CardProps } from './card.props.js';
export function Card(props: CardProps): ReactNode {
  return useDeclaration('Card', cardSchema, props);
}
