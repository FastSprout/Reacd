import type { ReactNode } from 'react';
import type { ThemeProps } from './theme.props.js';
import { themeSchema } from '../../schema/theme/theme.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ThemeProps } from './theme.props.js';
export function Theme(props: ThemeProps): ReactNode {
  return useDeclaration('Theme', themeSchema, props);
}
