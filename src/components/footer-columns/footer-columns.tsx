import type { ReactNode } from 'react';
import type { FooterColumnsProps } from './footer-columns.props.js';
import {
  footerColumnsSchema,
} from '../../schema/footer-columns/footer-columns.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { FooterColumnsProps } from './footer-columns.props.js';
export function FooterColumns(props: FooterColumnsProps): ReactNode {
  return useDeclaration('FooterColumns', footerColumnsSchema, props);
}
