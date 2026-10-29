import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from 'reacd';
import { AlertExample } from './alert.js';
import { BadgeExample } from './badge.js';
import { ButtonExample } from './button.js';
import { CardExample } from './card.js';
import { IconExample } from './icon.js';
import { ProgressExample } from './progress.js';
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
