import type { ReactNode } from 'react';
import type { ChangelogVersionsProps } from './changelog-versions.props.js';
import { changelogVersionsSchema }
  from '../../schema/changelog-versions/changelog-versions.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChangelogVersionsProps } from './changelog-versions.props.js';
export function ChangelogVersions(props: ChangelogVersionsProps): ReactNode {
  return useDeclaration('ChangelogVersions', changelogVersionsSchema, props);
}
