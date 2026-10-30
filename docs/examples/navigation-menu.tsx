import { atom, useAtom } from 'jotai';
import {
  Input,
  NavigationMenu,
  Section,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const verticalAtom = atom(false);
const disabledAtom = atom(false);
const messageAtom = atom('No navigation action selected.');
const groupLabelAtom = atom('Sample resources');

export function NavigationMenuExample() {
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [groupLabel, setGroupLabel] = useAtom(groupLabelAtom);
  return (
    <Section title="Navigation menu preview">
      <VStack>
        <Input
          label="Menu group label"
          value={groupLabel}
          onValueChange={setGroupLabel}
        />
        <Toggle
          label="Vertical navigation menu"
          checked={vertical}
          onCheckedChange={setVertical}
        />
        <Toggle
          label="Disable menu action"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <NavigationMenu
          label="Sample application resources"
          orientation={vertical ? 'vertical' : 'horizontal'}
          items={[
            {
              key: 'resources',
              label: groupLabel.trim() === '' ? 'Sample resources' : groupLabel,
              description: 'Local example actions preserve the current page.',
              children: [
                { key: 'home', label: 'Menu workbench home', href: '/', active: true },
                {
                  key: 'open',
                  label: 'Open sample locally',
                  disabled,
                  onPress: () => setMessage('Sample opened locally.'),
                },
              ],
            },
            {
              key: 'help',
              label: 'Menu help locally',
              onPress: () => setMessage('Menu help selected locally.'),
            },
          ]}
        />
        <Text>{message}</Text>
      </VStack>
    </Section>
  );
}
