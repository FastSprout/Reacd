import { atom, useAtom } from 'jotai';
import { Avatar, Input, Section, Select, Text, VStack } from '@fastsprout/reacd';

const nameAtom = atom('Example Reader');
const sourceAtom = atom('fallback');
const sizeAtom = atom('medium');
const fallbackAtom = atom('');
const DEFAULT_NAME = 'Example Reader';
const SOURCES = [
  { value: 'fallback', label: 'Initials only' },
  { value: 'image', label: 'Local placeholder image' },
  { value: 'broken', label: 'Undecodable image' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
export function AvatarExample() {
  const [name, setName] = useAtom(nameAtom);
  const [source, setSource] = useAtom(sourceAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [fallback, setFallback] = useAtom(fallbackAtom);
  const src =
    source === 'image'
      ? '/avatar-placeholder.svg'
      : source === 'broken'
        ? '/avatar-unavailable.svg'
        : undefined;
  return (
    <Section title="Avatar preview">
      <VStack>
        <Text>Avatar images are local placeholders, not real profile photos.</Text>
        <Input label="Avatar name" value={name} onValueChange={setName} />
        <Input
          label="Avatar fallback text"
          value={fallback}
          onValueChange={setFallback}
          placeholder="Optional, at most two Unicode graphemes"
        />
        <Select
          label="Avatar source"
          value={source}
          items={SOURCES}
          onValueChange={setSource}
        />
        <Select
          label="Avatar size"
          value={size}
          items={SIZES}
          onValueChange={setSize}
        />
        <Avatar
          name={name.trim() || DEFAULT_NAME}
          src={src}
          fallback={fallback.trim() || undefined}
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
        />
      </VStack>
    </Section>
  );
}
