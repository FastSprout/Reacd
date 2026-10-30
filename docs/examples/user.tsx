import { atom, useAtom } from 'jotai';
import { App, Input, Section, Text, Toggle, User, VStack } from '@fastsprout/reacd';

const verticalAtom = atom(false);
const disabledAtom = atom(false);
const visitsAtom = atom(0);
const nameAtom = atom('Ada Lovelace');
const descriptionAtom = atom('Research engineer');
const rtlAtom = atom(false);

export function UserExample() {
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [visits, setVisits] = useAtom(visitsAtom);
  const [name, setName] = useAtom(nameAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="User identity preview">
      <VStack>
        <Input label="User name" value={name} onValueChange={setName} />
        <Input
          label="User description"
          value={description}
          onValueChange={setDescription}
        />
        <Toggle
          label="Vertical identity"
          checked={vertical}
          onCheckedChange={setVertical}
        />
        <Toggle
          label="Disable profile action"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle label="Right to left identity" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <User
            name={name.trim() === '' ? 'Ada Lovelace' : name}
            description={description}
            avatar={{ fallback: 'AL' }}
            orientation={vertical ? 'vertical' : 'horizontal'}
            disabled={disabled}
            onPress={() => setVisits(visits + 1)}
          />
          <User name="Read the User guide" href="/components/user/" />
        </App>
        <Text>{`Profile actions: ${visits}`}</Text>
      </VStack>
    </Section>
  );
}
