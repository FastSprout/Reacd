import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from 'reacd';
import { PageAnchorsExample } from '../../docs/examples/page-anchors.js';
import { PageLinksExample } from '../../docs/examples/page-links.js';
import { PageCTAExample } from '../../docs/examples/page-cta.js';
import { PageExample } from '../../docs/examples/page.js';

const rtlAtom = atom(false);

export function PageNavigationExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Page navigation and actions">
      <Toggle label="Page navigation RTL" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'} language="en">
        <VStack>
          <PageAnchorsExample />
          <PageLinksExample />
          <PageCTAExample />
          <PageExample />
        </VStack>
      </App>
    </Section>
  );
}
