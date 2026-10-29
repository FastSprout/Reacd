import { Children } from 'react';
import type { ReactNode } from 'react';
import type { ChangelogVersionsProps }
  from '../../../components/changelog-versions/changelog-versions.props.js';
import { ChangelogVersion }
  from '../../../components/changelog-version/changelog-version.js';
import { EDITORIAL_DEFAULTS } from '../../../core/editorial-policy.js';
import { EditorialIndicatorContext }
  from '../../../renderer/editorial/indicator-context.js';

export function ShadcnChangelogVersions({
  children,
  versions = EDITORIAL_DEFAULTS.entries,
  indicator = EDITORIAL_DEFAULTS.indicator,
}: ChangelogVersionsProps): ReactNode {
  return (
    <EditorialIndicatorContext.Provider value={indicator}>
      <ul className="reacd-node reacd-editorial-collection" data-orientation="vertical">
        {versions.map(({ key, ...entry }) => (
          <li key={key}>
            <ChangelogVersion {...entry} />
          </li>
        ))}
        {Children.map(children, (child) => (child == null ? null : <li>{child}</li>))}
      </ul>
    </EditorialIndicatorContext.Provider>
  );
}
