import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from '@fastsprout/reacd';
import { AlertExample } from '../../../docs/examples/alert.js';
import { BadgeExample } from '../../../docs/examples/badge.js';
import { ButtonExample } from './button.js';
import { CardExample } from '../../../docs/examples/card.js';
import { IconExample } from '../../../docs/examples/icon.js';
import { ProgressExample } from '../../../docs/examples/progress.js';
import { ElementStressExample } from './element-stress.js';
const rtlAtom = atom(false);

export function ElementFoundationsExample() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Element foundations">
      <Toggle label="Right to left elements" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <ButtonExample />
          <BadgeExample />
          <IconExample />
          <CardExample />
          <AlertExample />
          <ProgressExample />
          <ElementStressExample />
        </VStack>
      </App>
    </Section>
  );
}
