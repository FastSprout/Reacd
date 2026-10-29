import type { ReactNode } from 'react';
import type { PageHeaderProps }
  from '../../../components/page-header/page-header.props.js';
import { PageIntroduction }
  from '../../../renderer/page-introduction/page-introduction.js';

export function ShadcnPageHeader(props: PageHeaderProps): ReactNode {
  return <PageIntroduction {...props} kind="header" />;
}
