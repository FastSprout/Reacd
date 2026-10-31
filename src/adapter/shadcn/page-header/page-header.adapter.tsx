import type { ReactNode } from 'react';
import type { PageHeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-header/page-header.props.js';
import { PageIntroduction } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-introduction.js';

export function ShadcnPageHeader(props: PageHeaderProps): ReactNode {
  return <PageIntroduction {...props} kind="header" />;
}
