import type { ReactNode } from 'react';
import type { ChangelogVersionProps } from
  '@fastsprout/reacd/adapter-runtime/components/changelog-version/index.js';
import { EditorialEntrySurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/editorial/editorial-entry.js';

export function SharedChangelogVersion(props: ChangelogVersionProps): ReactNode {
  return <EditorialEntrySurface {...props} kind="changelog" />;
}
