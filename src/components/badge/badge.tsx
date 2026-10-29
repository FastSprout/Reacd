import type { ReactNode } from 'react';
import type { BadgeProps } from './badge.props.js';
import { badgeSchema } from '../../schema/badge/badge.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { BadgeProps } from './badge.props.js';
export function Badge(props: BadgeProps): ReactNode {
  return useDeclaration('Badge', badgeSchema, props);
}
