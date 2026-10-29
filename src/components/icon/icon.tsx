import type { ReactNode } from 'react';
import type { IconProps } from './icon.props.js';
import { iconSchema } from '../../schema/icon/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function Icon(properties: IconProps): ReactNode {
  return useDeclaration('Icon', iconSchema, properties);
}
