import type { ReactNode } from 'react';
import type { KbdProps } from './kbd.props.js';
import { kbdSchema } from '../../schema/kbd/kbd.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { KbdProps } from './kbd.props.js';
export function Kbd(props: KbdProps): ReactNode {
  return useDeclaration('Kbd', kbdSchema, props);
}
