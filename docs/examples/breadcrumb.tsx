import { atom, useAtom } from 'jotai';
import { Breadcrumb, Input, Section, Select, Text, Toggle, VStack } from 'reacd';
const finalAtom = atom('Current record');
const separatorAtom = atom('chevron');
const disabledAtom = atom(false);
const deepAtom = atom(false);
const messageAtom = atom('Local ancestor actions update this message.');
const SAMPLE_DEPTH = 6;
const SEPARATORS = [
  { value: 'chevron', label: 'Chevron' },
  { value: 'slash', label: 'Slash' },
];
export function BreadcrumbExample() {
  const [final, setFinal] = useAtom(finalAtom);
  const [separator, setSeparator] = useAtom(separatorAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [deep, setDeep] = useAtom(deepAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const ancestors = deep
    ? Array.from({ length: SAMPLE_DEPTH }, (_, index) => ({
        key: `ancestor.${index}`,
        label: `Sample ancestor ${index + 1}`,
      }))
    : [];
  return (
    <Section title="Breadcrumb preview">
      <VStack>
        <Input label="Breadcrumb final label" value={final} onValueChange={setFinal} />
        <Select
          label="Breadcrumb separator"
          value={separator}
          items={SEPARATORS}
          onValueChange={setSeparator}
        />
        <Toggle
          label="Disable breadcrumb action"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle label="Deep breadcrumb path" checked={deep} onCheckedChange={setDeep} />
        <Breadcrumb
          label="Sample navigation path"
          separator={separator === 'slash' ? 'slash' : 'chevron'}
          items={[
            { key: 'workspace', label: 'Workspace', href: '/' },
            {
              key: 'projects',
              label: 'Sample projects',
              disabled,
              onPress: () => setMessage('Selected Sample projects locally.'),
            },
            ...ancestors,
            { key: 'current', label: final.trim() === '' ? 'Current record' : final },
          ]}
        />
        <Text>{message}</Text>
      </VStack>
    </Section>
  );
}
