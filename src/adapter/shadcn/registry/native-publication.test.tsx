import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  defineThemeAdapter,
  ReacdProvider,
  BlogPost,
  BlogPosts,
  ChangelogVersion,
  ChangelogVersions,
  ContentSurround,
  FooterColumns,
  PricingPlan,
  PricingPlans,
  PricingTable,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativePublicationEntries } from './native-publication.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativePublicationEntries },
});
it.each([
  <BlogPost key="post" title="Declared" />,
  <BlogPosts key="posts" posts={[{ key: 'one', title: 'Declared' }]} />,
  <ChangelogVersion key="version" title="Declared" />,
  <ChangelogVersions key="versions" versions={[{ key: 'one', title: 'Declared' }]} />,
  <ContentSurround key="surround" emptyLabel="Declared" />,
  <FooterColumns key="columns" label="Footer" columns={[]} left="Declared" />,
  <PricingPlan key="plan" title="Declared" />,
  <PricingPlans key="plans" plans={[{ key: 'one', title: 'Declared' }]} />,
  <PricingTable
    key="table"
    caption="Declared"
    tiers={[{ id: 'one', title: 'Tier' }]}
    sections={[]}
  />,
])('maps the closed publication declaration to actual selected SDK %#', (node) => {
  render(<ReacdProvider adapter={adapter}>{node}</ReacdProvider>);
  expect(screen.getByText('Declared')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});
