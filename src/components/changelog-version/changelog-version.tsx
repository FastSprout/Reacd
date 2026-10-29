import type { ReactNode } from 'react';
import type { ChangelogVersionProps } from './changelog-version.props.js';
import { changelogVersionSchema }
  from '../../schema/changelog-version/changelog-version.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChangelogVersionProps } from './changelog-version.props.js';
export function ChangelogVersion(props: ChangelogVersionProps): ReactNode {
  return useDeclaration('ChangelogVersion', changelogVersionSchema, props);
}
