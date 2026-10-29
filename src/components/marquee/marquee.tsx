import type { ReactNode } from 'react';
import type { MarqueeProps } from './marquee.props.js';
import { marqueeSchema } from '../../schema/marquee/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function Marquee(properties: MarqueeProps): ReactNode {
  return useDeclaration('Marquee', marqueeSchema, properties);
}
