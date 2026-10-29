import type { ReactNode } from 'react';
import type { PageSectionProps }
  from '../../../components/page-section/page-section.props.js';
import { PageIntroduction }
  from '../../../renderer/page-introduction/page-introduction.js';

export function ShadcnPageSection(props: PageSectionProps): ReactNode {
  return <PageIntroduction {...props} kind="section" />;
}
