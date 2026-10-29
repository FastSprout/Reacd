import type { ReactNode } from 'react';
import type { FooterProps } from './footer.props.js';
import { footerSchema } from '../../schema/footer/footer.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { FooterProps } from './footer.props.js';
export function Footer(props: FooterProps): ReactNode {
  return useDeclaration('Footer', footerSchema, props);
}
