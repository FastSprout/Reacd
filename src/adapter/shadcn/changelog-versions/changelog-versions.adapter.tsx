import { Children } from 'react';
import type { ChangelogVersionsProps } from
  '@fastsprout/reacd/adapter-runtime/components/changelog-versions/index.js';
import { EDITORIAL_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import { ShadcnChangelogVersion } from
  '../changelog-version/changelog-version.adapter.js';
import { ChangelogIndicatorContext } from '../changelog-version/indicator-context.js';

export type ShadcnChangelogVersionsProps = ChangelogVersionsProps;
export function ShadcnChangelogVersions({
  versions = EDITORIAL_DEFAULTS.entries,
  indicator = EDITORIAL_DEFAULTS.indicator,
  children,
}: ChangelogVersionsProps) {
  return (
    <ChangelogIndicatorContext value={indicator}>
      <CardContent
        role="list"
        className="grid min-w-0 p-0"
        style={{ gap: 'var(--space-medium)' }}
      >
        {versions.map(({ key, ...version }) => (
          <CardContent role="listitem" key={key} className="min-w-0 p-0">
            <ShadcnChangelogVersion {...version} />
          </CardContent>
        ))}
        {Children.map(Children.toArray(children), (child) => (
          <CardContent role="listitem" className="min-w-0 p-0">
            {child}
          </CardContent>
        ))}
      </CardContent>
    </ChangelogIndicatorContext>
  );
}
