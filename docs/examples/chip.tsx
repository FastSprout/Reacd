import { atom, useAtom } from 'jotai';
import {
  Avatar,
  Button,
  Chip,
  Input,
  Section,
  Select,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const textAtom = atom('5');
const showAtom = atom(true);
const insetAtom = atom(false);
const standaloneAtom = atom(false);
const cornerAtom = atom('top-end');
const sizeAtom = atom('medium');
const intentAtom = atom('primary');
const pressesAtom = atom(0);
const CORNERS = [
  { value: 'top-start', label: 'Top start' },
  { value: 'top-end', label: 'Top end' },
  { value: 'bottom-start', label: 'Bottom start' },
  { value: 'bottom-end', label: 'Bottom end' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const INTENTS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'danger', label: 'Danger' },
];
export function ChipExample() {
  const [text, setText] = useAtom(textAtom);
  const [show, setShow] = useAtom(showAtom);
  const [inset, setInset] = useAtom(insetAtom);
  const [standalone, setStandalone] = useAtom(standaloneAtom);
  const [corner, setCorner] = useAtom(cornerAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [intent, setIntent] = useAtom(intentAtom);
  const [presses, setPresses] = useAtom(pressesAtom);
  return (
    <Section title="Chip preview">
      <VStack>
        <Text>Counts and identities in this preview are sample data.</Text>
        <Input label="Chip text" value={text} onValueChange={setText} />
        <Select
          label="Chip corner"
          value={corner}
          items={CORNERS}
          onValueChange={setCorner}
        />
        <Select label="Chip size" value={size} items={SIZES} onValueChange={setSize} />
        <Select
          label="Chip intent"
          value={intent}
          items={INTENTS}
          onValueChange={setIntent}
        />
        <Toggle label="Show chip" checked={show} onCheckedChange={setShow} />
        <Toggle label="Inset chip" checked={inset} onCheckedChange={setInset} />
        <Toggle
          label="Standalone chip"
          checked={standalone}
          onCheckedChange={setStandalone}
        />
        <Chip
          label="Unread placeholder"
          text={text === '' ? undefined : text}
          show={show}
          inset={inset}
          standalone={standalone}
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
          intent={
            intent === 'danger'
              ? 'danger'
              : intent === 'secondary'
                ? 'secondary'
                : 'primary'
          }
          corner={
            corner === 'top-start'
              ? 'top-start'
              : corner === 'bottom-start'
                ? 'bottom-start'
                : corner === 'bottom-end'
                  ? 'bottom-end'
                  : 'top-end'
          }
        >
          {standalone ? null : (
            <Button
              label="Open sample messages"
              onPress={() => setPresses(presses + 1)}
            />
          )}
        </Chip>
        <Text>{`Sample action count: ${presses}`}</Text>
        <Chip label="Available placeholder" inset>
          <Avatar name="Example Reader" />
        </Chip>
      </VStack>
    </Section>
  );
}
