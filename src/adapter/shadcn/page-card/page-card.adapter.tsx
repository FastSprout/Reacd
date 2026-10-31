import type { ReactNode } from 'react';
import type { PageCardProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-card/page-card.props.js';
import { PageIntroduction } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-introduction.js';

export function ShadcnPageCard(props: PageCardProps): ReactNode {
  return <PageIntroduction {...props} kind="card" />;
}
