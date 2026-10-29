import { atom, useAtom } from 'jotai';
import { Grid, HStack, Input, Section, Select, Skeleton, Toggle, VStack } from 'reacd';

const shapeAtom = atom('text');
const sizeAtom = atom('medium');
const linesAtom = atom('three');
const labelAtom = atom('Loading sample records');
const animatedAtom = atom(true);
const showAtom = atom(true);
const LINE_COUNTS = { one: 1, three: 3, eight: 8 } as const;
const SHAPES = [
  { value: 'text', label: 'Text' },
  { value: 'avatar', label: 'Avatar' },
  { value: 'rectangle', label: 'Rectangle' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const LINES = [
  { value: 'one', label: 'One line' },
  { value: 'three', label: 'Three lines' },
  { value: 'eight', label: 'Eight lines' },
];
export function SkeletonExample() {
  const [shape, setShape] = useAtom(shapeAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [lines, setLines] = useAtom(linesAtom);
  const [label, setLabel] = useAtom(labelAtom);
  const [animated, setAnimated] = useAtom(animatedAtom);
  const [show, setShow] = useAtom(showAtom);
  const selectedShape =
    shape === 'avatar' ? 'avatar' : shape === 'rectangle' ? 'rectangle' : 'text';
  return (
    <Section title="Loading placeholder preview">
      <VStack>
        <Input
          label="Placeholder status label"
          value={label}
          onValueChange={setLabel}
          placeholder="Leave blank for a decorative placeholder"
        />
        <Grid columns={3}>
          <Select
            label="Placeholder shape"
            value={shape}
            items={SHAPES}
            onValueChange={setShape}
          />
          <Select
            label="Placeholder size"
            value={size}
            items={SIZES}
            onValueChange={setSize}
          />
          <Select
            label="Placeholder lines"
            value={lines}
            items={LINES}
            onValueChange={setLines}
            disabled={selectedShape !== 'text'}
          />
        </Grid>
        <Toggle
          label="Animate placeholder"
          checked={animated}
          onCheckedChange={setAnimated}
        />
        <Toggle label="Show placeholder" checked={show} onCheckedChange={setShow} />
        <Section title="Current placeholder">
          <Skeleton
            label={label.trim() === '' ? undefined : label}
            shape={selectedShape}
            size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
            lines={
              selectedShape === 'text'
                ? LINE_COUNTS[
                    lines === 'one' ? 'one' : lines === 'eight' ? 'eight' : 'three'
                  ]
                : undefined
            }
            animated={animated}
            show={show}
          />
        </Section>
        <Section title="Decorative composition">
          <HStack>
            <Skeleton shape="avatar" />
            <Skeleton lines={2} />
          </HStack>
        </Section>
      </VStack>
    </Section>
  );
}
