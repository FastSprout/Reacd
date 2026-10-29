import type { ReactNode } from 'react';
import type { SplitterProps } from './splitter.props.js';
import { splitterSchema } from '../../schema/splitter/splitter.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Splitter(props: SplitterProps): ReactNode {
  return useDeclaration('Splitter', splitterSchema, props);
}
