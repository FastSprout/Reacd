import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from '@fastsprout/reacd';
import { PageAsideExample } from '../../../docs/examples/page-aside.js';
import { PageBodyExample } from '../../../docs/examples/page-body.js';
import { PageColumnsExample } from '../../../docs/examples/page-columns.js';
import { PageGridExample } from '../../../docs/examples/page-grid.js';
import { PageListExample } from '../../../docs/examples/page-list.js';

const rtlAtom = atom(false);

export function PageCompositionExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <Section title="Page composition">
        <VStack>
          <Toggle label="Page composition RTL" checked={rtl} onCheckedChange={setRtl} />
          <PageAsideExample />
          <PageBodyExample />
          <PageColumnsExample />
          <PageGridExample />
          <PageListExample />
        </VStack>
      </Section>
    </App>
  );
}
