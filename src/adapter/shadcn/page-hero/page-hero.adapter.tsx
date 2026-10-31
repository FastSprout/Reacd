import type { ReactNode } from 'react';
import type { PageHeroProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-hero/page-hero.props.js';
import { PageIntroduction } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-introduction.js';

export function ShadcnPageHero(props: PageHeroProps): ReactNode {
  return <PageIntroduction {...props} kind="hero" />;
}
