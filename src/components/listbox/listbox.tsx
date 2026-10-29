import type { ReactNode } from 'react';
import type { ListboxProps } from './listbox.props.js';
import { listboxSchema } from '../../schema/listbox/listbox.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ListboxProps } from './listbox.props.js';

export function Listbox(props: ListboxProps): ReactNode {
  return useDeclaration('Listbox', listboxSchema, props);
}
