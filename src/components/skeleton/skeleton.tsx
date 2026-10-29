import type { ReactNode } from 'react';
import type { SkeletonProps } from './skeleton.props.js';
import { skeletonSchema } from '../../schema/skeleton/skeleton.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { SkeletonProps } from './skeleton.props.js';
export function Skeleton(props: SkeletonProps): ReactNode {
  return useDeclaration('Skeleton', skeletonSchema, props);
}
