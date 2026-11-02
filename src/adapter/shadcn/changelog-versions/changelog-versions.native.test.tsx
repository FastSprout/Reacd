import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChangelogVersions } from './changelog-versions.adapter.js';
import { ShadcnChangelogVersion } from
  '../changelog-version/changelog-version.adapter.js';
it('inherits indicators and respects entry overrides', () => {
  const view = render(
    <ShadcnChangelogVersions
      indicator={false}
      versions={[
        { key: 'one', title: 'First' },
        { key: 'two', title: 'Second', indicator: true },
      ]}
    >
      <ShadcnChangelogVersion title="Third" />
    </ShadcnChangelogVersions>,
  );
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(view.container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
  view.rerender(
    <ShadcnChangelogVersions versions={[{ key: 'one', title: 'First' }]} />,
  );
  expect(view.container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
  view.rerender(<ShadcnChangelogVersions />);
  expect(screen.queryByRole('listitem')).toBeNull();
});
