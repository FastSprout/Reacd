import { atom, useAtom } from 'jotai';
import { Icon, Toggle, VStack } from 'reacd';
const decorativeAtom = atom(false);
const largeAtom = atom(false);
export function IconExample() {
  const [decorative, setDecorative] = useAtom(decorativeAtom);
  const [large, setLarge] = useAtom(largeAtom);
  return (
    <VStack>
      {decorative ? (
        <Icon name="search" decorative size={large ? 'large' : 'medium'} />
      ) : (
        <Icon
          name="search"
          label="Search workspace"
          size={large ? 'large' : 'medium'}
        />
      )}
      <Toggle
        label="Decorative icon"
        checked={decorative}
        onCheckedChange={setDecorative}
      />
      <Toggle label="Large icon" checked={large} onCheckedChange={setLarge} />
    </VStack>
  );
}
