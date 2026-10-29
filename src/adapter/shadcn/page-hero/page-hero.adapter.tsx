import type { ReactNode } from 'react';
import type { PageHeroProps } from '../../../components/page-hero/page-hero.props.js';
import { PageIntroduction }
  from '../../../renderer/page-introduction/page-introduction.js';

export function ShadcnPageHero(props: PageHeroProps): ReactNode {
  return <PageIntroduction {...props} kind="hero" />;
}
