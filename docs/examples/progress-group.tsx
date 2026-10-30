import { atom, useAtom } from 'jotai';
import {
  App,
  Input,
  ProgressGroup,
  Section,
  Slider,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const STORAGE = { capacity: 128, applications: 24, documents: 16 } as const;
const usedAtom = atom<number>(STORAGE.applications);
const statusAtom = atom(true);
const labelAtom = atom('Applications');
const rtlAtom = atom(false);

export function ProgressGroupExample() {
  const [used, setUsed] = useAtom(usedAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [label, setLabel] = useAtom(labelAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Storage allocation preview">
      <VStack>
        <Input label="Progress segment label" value={label} onValueChange={setLabel} />
        <Slider
          label="Application storage"
          min={0}
          max={STORAGE.capacity}
          value={used}
          onValueChange={setUsed}
        />
        <Toggle
          label="Show storage total"
          checked={status}
          onCheckedChange={setStatus}
        />
        <Toggle label="Right to left segments" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <ProgressGroup
            label="Storage allocation"
            max={STORAGE.capacity}
            showStatus={status}
            items={[
              {
                id: 'apps',
                label: label.trim() === '' ? 'Applications' : label,
                value: used,
              },
              {
                id: 'documents',
                label: 'Documents',
                value: STORAGE.documents,
                intent: 'secondary',
              },
            ]}
          />
        </App>
      </VStack>
    </Section>
  );
}
