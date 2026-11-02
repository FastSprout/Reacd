import { atom, useAtom } from 'jotai';
import type { ReactNode } from 'react';
import {
  Card,
  Link,
  PageHero,
  PageSection,
  Prose,
  Tabs,
  VStack,
} from '@fastsprout/reacd';
import type { SitePayload } from './model.js';
import type { DesignTemplate } from '@fastsprout/reacd';
import { LivePreview } from './preview.js';
import { HomeTemplates } from './home-templates.js';

const galleryAtom = atom('components');

export function SiteHome({
  payload,
  appearance,
  design,
  themePicker,
}: {
  readonly payload: SitePayload;
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
  readonly themePicker?: ReactNode;
}) {
  const [gallery, setGallery] = useAtom(galleryAtom);
  const code = payload.page.sections.filter((section) => section.type === 'prose');
  return (
    <VStack spacing="large">
      <PageHero
        title="React views. Only components."
        description={payload.description}
        headline="reacd"
        orientation="horizontal"
        links={<Link href="/getting-started/" label="Get started" />}
      >
        <Card>
          {code.map((section) => (
            <Prose key={section.key} document={section.document} />
          ))}
        </Card>
      </PageHero>
      <PageSection title="Components and templates" top={themePicker}>
        <Tabs
          label="Homepage examples"
          value={gallery}
          onValueChange={setGallery}
          items={[
            {
              value: 'components',
              label: 'Components',
              content: (
                <LivePreview
                  appearance={appearance}
                  design={design}
                  entry={{ type: 'preview', key: 'home-showcase', example: 'Showcase' }}
                />
              ),
            },
            {
              value: 'templates',
              label: 'Templates',
              content: <HomeTemplates appearance={appearance} design={design} />,
            },
          ]}
        />
      </PageSection>
    </VStack>
  );
}
