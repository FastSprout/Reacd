import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from '@fastsprout/reacd';
import { PageHeaderExample } from '../../../docs/examples/page-header.js';
import { PageFeatureExample } from '../../../docs/examples/page-feature.js';
import { PageCardExample } from '../../../docs/examples/page-card.js';
import { PageHeroExample } from '../../../docs/examples/page-hero.js';
import { PageSectionExample } from '../../../docs/examples/page-section.js';

const rtlAtom = atom(false);

export function PagePresentationExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Page presentation">
      <Toggle label="Page presentation RTL" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'} language="en">
        <VStack>
          <PageHeaderExample />
          <PageFeatureExample />
          <PageCardExample />
          <PageHeroExample />
          <PageSectionExample />
        </VStack>
      </App>
    </Section>
  );
}
