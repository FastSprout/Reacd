import type { ReactNode } from 'react';
import { localeSelectSchema } from '../../schema/locale-select/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { LocaleSelectProps } from './locale-select.props.js';

export function LocaleSelect(props: LocaleSelectProps): ReactNode {
  return useDeclaration('LocaleSelect', localeSelectSchema, props);
}
