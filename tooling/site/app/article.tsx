import { ContentToc, Page, Prose, VStack } from '@fastsprout/reacd';
import type { DesignTemplate } from '@fastsprout/reacd';
import type { SiteActions, SitePayload } from './model.js';
import { DocumentationNavigation } from './navigation.js';
import { LivePreview } from './preview.js';
import { PageActions } from './actions.js';

export function DocumentationArticle({
  payload,
  appearance,
  design,
  actions,
}: {
  readonly payload: SitePayload;
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
  readonly actions: SiteActions;
}) {
  const page = payload.page;
  return (
    <Page
      title={page.title}
      anchor={page.titleAnchor}
      left={<DocumentationNavigation items={payload.navigation} route={page.route} />}
      right={
        <ContentToc
          label="On this page"
          items={page.headings.map((heading) => ({
            key: heading.id,
            label: heading.title,
          }))}
        />
      }
    >
      <VStack spacing="large">
        <PageActions source={page.source} actions={actions} />
        {page.sections.map((section) =>
          section.type === 'prose' ? (
            <Prose key={section.key} document={section.document} />
          ) : (
            <LivePreview
              key={section.key}
              entry={section}
              appearance={appearance}
              design={design}
            />
          ),
        )}
      </VStack>
    </Page>
  );
}
