import type { ReactNode } from 'react';
import type { AppProps } from './app.props.js';
import { appSchema } from '../../schema/app/app.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { AppProps } from './app.props.js';
export function App(props: AppProps): ReactNode {
  return useDeclaration('App', appSchema, props);
}
