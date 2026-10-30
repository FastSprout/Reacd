import { atom, useAtom } from 'jotai';
import {
  AvatarGroup,
  Section,
  Select,
  Slider,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const maximumAtom = atom(2);
const emptyAtom = atom(false);
const stressAtom = atom(false);
const sizeAtom = atom('medium');
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const LIMITS = { min: 1, max: 3 } as const;
const STRESS_ITEM_COUNT = 100;
const LONG_NAME_REPETITIONS = 12;
const ITEMS = [
  { id: 'reader', name: 'Example Reader', src: '/avatar-placeholder.svg' },
  { id: 'editor', name: 'Example Editor' },
  {
    id: 'reviewer',
    name: 'Example reviewer ' + 'long_identifier_'.repeat(LONG_NAME_REPETITIONS),
  },
  { id: 'observer', name: '👩‍💻 Example Observer' },
];
const STRESS_ITEMS = Array.from({ length: STRESS_ITEM_COUNT }, (_, index) => ({
  id: `placeholder-${index + 1}`,
  name: `Placeholder ${index + 1}`,
}));
export function AvatarGroupExample() {
  const [maximum, setMaximum] = useAtom(maximumAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [stress, setStress] = useAtom(stressAtom);
  const [size, setSize] = useAtom(sizeAtom);
  return (
    <Section title="Avatar group preview">
      <VStack>
        <Text>
          Sample identities demonstrate overflow; no real people are represented.
        </Text>
        <Slider
          label="Visible people"
          value={maximum}
          min={LIMITS.min}
          max={LIMITS.max}
          onValueChange={setMaximum}
        />
        <Toggle label="Empty avatar group" checked={empty} onCheckedChange={setEmpty} />
        <Toggle
          label="Use maximum-size group"
          checked={stress}
          onCheckedChange={setStress}
        />
        <Select
          label="Group avatar size"
          value={size}
          items={SIZES}
          onValueChange={setSize}
        />
        <AvatarGroup
          label="Reviewer placeholders"
          items={empty ? [] : stress ? STRESS_ITEMS : ITEMS}
          max={maximum}
          emptyMessage="Nobody assigned in this example."
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
        />
      </VStack>
    </Section>
  );
}
