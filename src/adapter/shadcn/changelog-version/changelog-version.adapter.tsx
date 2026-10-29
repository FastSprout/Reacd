import type { ReactNode } from 'react';
import type { ChangelogVersionProps }
  from '../../../components/changelog-version/changelog-version.props.js';
import { EditorialEntrySurface } from '../../../renderer/editorial/editorial-entry.js';

export function ShadcnChangelogVersion(props: ChangelogVersionProps): ReactNode {
  return <EditorialEntrySurface {...props} kind="changelog" />;
}
