import type { ReactNode } from 'react';
import type { PageCTAProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-cta/page-cta.props.js';
import { PageIntroduction } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-introduction.js';

export function ShadcnPageCTA(props: PageCTAProps): ReactNode {
  return <PageIntroduction {...props} kind="cta" />;
}
