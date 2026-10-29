import type { ReactNode } from 'react';
import type { PageCardProps } from '../../../components/page-card/page-card.props.js';
import { PageIntroduction }
  from '../../../renderer/page-introduction/page-introduction.js';

export function ShadcnPageCard(props: PageCardProps): ReactNode {
  return <PageIntroduction {...props} kind="card" />;
}
