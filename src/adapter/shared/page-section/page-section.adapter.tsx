import type { ReactNode } from 'react';
import type { PageSectionProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-section/page-section.props.js';
import { PageIntroduction } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-introduction.js';

export function SharedPageSection(props: PageSectionProps): ReactNode {
  return <PageIntroduction {...props} kind="section" />;
}
