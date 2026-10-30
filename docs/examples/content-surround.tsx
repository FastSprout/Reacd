import { atom, useAtom } from 'jotai';
import { ContentSurround, Input, Toggle, VStack } from '@fastsprout/reacd';

const titleAtom = atom('Earlier reference');
const emptyAtom = atom(false);

export function ContentSurroundExample() {
  const [title, setTitle] = useAtom(titleAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  return (
    <VStack>
      <Input label="Previous reference title" value={title} onValueChange={setTitle} />
      <Toggle
        label="No adjacent documents"
        checked={empty}
        onCheckedChange={setEmpty}
      />
      <ContentSurround
        label="Adjacent reference"
        previous={
          empty || title.trim().length === 0
            ? undefined
            : { title, href: '/', description: 'Earlier topic.' }
        }
        next={
          empty
            ? undefined
            : {
                title: 'Next reference',
                href: '/',
                description: 'Later topic.',
                newWindow: true,
              }
        }
      />
    </VStack>
  );
}
