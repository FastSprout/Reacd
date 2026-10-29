import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import {
  Page,
  PageAnchors,
  PageCTA,
  PageHeader,
  PageLinks,
  PageSection,
  ReacdProvider,
  Section,
  Text,
} from '../../../index.js';

it('connects named navigation to semantic heading targets and page slots', () => {
  render(
    <ReacdProvider>
      <Page
        title="Page"
        anchor="page"
        left={<Text>Left region</Text>}
        right={<Text>Right region</Text>}
      >
        <PageHeader title="Header" anchor="header" />
        <PageSection title="Target section" anchor="target">
          <Section title="Subsection" anchor="subsection">
            Body region
          </Section>
        </PageSection>
        <PageAnchors
          label="Page anchors"
          activeKey="target"
          links={[
            {
              key: 'target',
              label: 'Read target',
              href: '#target',
              leading: <Text>Local</Text>,
            },
          ]}
        />
        <PageLinks
          label="Reference links"
          title="Related references"
          links={[
            {
              key: 'external',
              label: 'External reference',
              href: 'https://example.com',
              newWindow: true,
            },
          ]}
        />
        <PageLinks label="Empty references" />
        <PageCTA
          title="Continue reading"
          links={<Text>Safe action slot</Text>}
          top="CTA top"
          header="CTA header"
          footer="CTA footer"
          bottom="CTA bottom"
        >
          CTA child
        </PageCTA>
      </Page>
    </ReacdProvider>,
  );
  for (const [name, anchor] of [
    ['Page', 'page'],
    ['Header', 'header'],
    ['Target section', 'target'],
    ['Subsection', 'subsection'],
  ] as const) {
    expect(screen.getByRole('heading', { name })).toHaveAttribute('id', anchor);
    expect(screen.getByRole('heading', { name })).toHaveAttribute('tabindex', '-1');
  }
  expect(screen.getByRole('link', { name: 'Local Read target' })).toHaveAttribute(
    'aria-current',
    'location',
  );
  expect(screen.getByRole('link', { name: 'External reference' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  const main = screen.getByRole('main');
  for (const text of [
    'Left region',
    'Body region',
    'Right region',
    'CTA top',
    'CTA header',
    'CTA footer',
    'CTA bottom',
    'CTA child',
    'Safe action slot',
  ]) {
    expect(main).toHaveTextContent(text);
  }
  expect(
    renderToString(
      <ReacdProvider>
        <Page title="SSR" />
      </ReacdProvider>,
    ),
  ).toContain('SSR');
});
