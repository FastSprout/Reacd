import type { ReactNode } from 'react';
import type { TabsProps } from './tabs.props.js';
import { tabsSchema } from '../../schema/tabs/tabs.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { TabsProps } from './tabs.props.js';
export function Tabs(props: TabsProps): ReactNode {
  return useDeclaration('Tabs', tabsSchema, props);
}
