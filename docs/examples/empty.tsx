import { atom, useAtom } from 'jotai';
import {
  Avatar,
  Button,
  Empty,
  Grid,
  Input,
  Section,
  Select,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const titleAtom = atom('No sample records');
const descriptionAtom = atom('Create a local record or change the recovery query.');
const sizeAtom = atom('medium');
const variantAtom = atom('outline');
const loadingAtom = atom(false);
const mediaAtom = atom(true);
const footerAtom = atom(true);
const queryAtom = atom('');
const countAtom = atom(0);
const messageAtom = atom('This example changes local state only.');
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const VARIANTS = [
  { value: 'outline', label: 'Outline' },
  { value: 'solid', label: 'Solid' },
  { value: 'soft', label: 'Soft' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'naked', label: 'Naked' },
];
export function EmptyExample() {
  const [title, setTitle] = useAtom(titleAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [variant, setVariant] = useAtom(variantAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [media, setMedia] = useAtom(mediaAtom);
  const [footer, setFooter] = useAtom(footerAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [count, setCount] = useAtom(countAtom);
  const [message, setMessage] = useAtom(messageAtom);
  return (
    <Section title="Empty state preview">
      <VStack>
        <Input label="Empty title" value={title} onValueChange={setTitle} />
        <Input
          label="Empty description"
          value={description}
          onValueChange={setDescription}
        />
        <Grid columns={2}>
          <Select
            label="Empty size"
            value={size}
            items={SIZES}
            onValueChange={setSize}
          />
          <Select
            label="Empty variant"
            value={variant}
            items={VARIANTS}
            onValueChange={setVariant}
          />
        </Grid>
        <Toggle
          label="Empty loading signal"
          checked={loading}
          onCheckedChange={setLoading}
        />
        <Toggle label="Show empty media" checked={media} onCheckedChange={setMedia} />
        <Toggle
          label="Show empty footer"
          checked={footer}
          onCheckedChange={setFooter}
        />
        <Empty
          title={title.trim() === '' ? 'No sample records' : title}
          description={description === '' ? undefined : description}
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
          variant={
            variant === 'solid'
              ? 'solid'
              : variant === 'soft'
                ? 'soft'
                : variant === 'subtle'
                  ? 'subtle'
                  : variant === 'naked'
                    ? 'naked'
                    : 'outline'
          }
          loading={loading}
          loadingLabel="Refreshing local data"
          leading={media ? <Avatar name="Example reader" fallback="ER" /> : undefined}
          actions={
            <Button label="Create sample record" onPress={() => setCount(count + 1)} />
          }
          footer={
            footer ? (
              <Button
                label="Empty state help"
                intent="secondary"
                onPress={() => setMessage('Change the query or create a local record.')}
              />
            ) : undefined
          }
        >
          <VStack>
            <Input
              label="Empty recovery query"
              value={query}
              onValueChange={setQuery}
            />
            <Text>
              {query === '' ? 'No recovery query entered.' : `Recovery query: ${query}`}
            </Text>
          </VStack>
        </Empty>
        <Text>{`Local sample records created: ${count}`}</Text>
        <Text>{message}</Text>
      </VStack>
    </Section>
  );
}
