import { atom, useAtom } from 'jotai';
import {
  Grid,
  HStack,
  Input,
  Kbd,
  Section,
  Select,
  Text,
  VStack,
} from '@fastsprout/reacd';

const valueAtom = atom('meta');
const platformAtom = atom('other');
const labelAtom = atom('');
const sizeAtom = atom('medium');
const variantAtom = atom('outline');
const intentAtom = atom('secondary');
const FALLBACK_KEY = 'K';
const PLATFORMS = [
  { value: 'other', label: 'Other platforms' },
  { value: 'apple', label: 'Apple' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const VARIANTS = [
  { value: 'outline', label: 'Outline' },
  { value: 'soft', label: 'Soft' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'solid', label: 'Solid' },
];
const INTENTS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'danger', label: 'Danger' },
];
export function KbdExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [platform, setPlatform] = useAtom(platformAtom);
  const [label, setLabel] = useAtom(labelAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [variant, setVariant] = useAtom(variantAtom);
  const [intent, setIntent] = useAtom(intentAtom);
  const keyPlatform = platform === 'apple' ? 'apple' : 'other';
  return (
    <Section title="Keyboard notation preview">
      <VStack>
        <Text>This view shows notation. It registers no keyboard shortcuts.</Text>
        <Input label="Key value" value={value} onValueChange={setValue} />
        <Input
          label="Key accessible label"
          value={label}
          onValueChange={setLabel}
          placeholder="Optional custom name"
        />
        <Grid columns={3}>
          <Select
            label="Key platform"
            value={platform}
            items={PLATFORMS}
            onValueChange={setPlatform}
          />
          <Select label="Key size" value={size} items={SIZES} onValueChange={setSize} />
          <Select
            label="Key variant"
            value={variant}
            items={VARIANTS}
            onValueChange={setVariant}
          />
          <Select
            label="Key intent"
            value={intent}
            items={INTENTS}
            onValueChange={setIntent}
          />
        </Grid>
        <Section title="Current key">
          <Kbd
            value={value.trim() || FALLBACK_KEY}
            label={label.trim() || undefined}
            platform={keyPlatform}
            size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
            variant={
              variant === 'solid'
                ? 'solid'
                : variant === 'soft'
                  ? 'soft'
                  : variant === 'subtle'
                    ? 'subtle'
                    : 'outline'
            }
            intent={
              intent === 'primary'
                ? 'primary'
                : intent === 'danger'
                  ? 'danger'
                  : 'secondary'
            }
          />
        </Section>
        <Text>Example chord:</Text>
        <HStack>
          <Kbd value="meta" platform={keyPlatform} />
          <Text>+</Text>
          <Kbd value="K" />
        </HStack>
      </VStack>
    </Section>
  );
}
