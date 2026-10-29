import type { ReactNode } from 'react';
import type { PageHeroProps } from './page-hero.props.js';
import { pageHeroSchema } from '../../schema/page-hero/page-hero.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageHeroProps } from './page-hero.props.js';
export function PageHero(props: PageHeroProps): ReactNode {
  return useDeclaration('PageHero', pageHeroSchema, props);
}
