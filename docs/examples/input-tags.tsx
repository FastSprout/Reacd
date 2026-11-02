import { atom, useAtom } from 'jotai';
import { InputTags } from '@fastsprout/reacd';

const topicsAtom = atom<readonly string[]>(['React']);

export function InputTagsExample() {
  const [topics, setTopics] = useAtom(topicsAtom);

  return (
    <InputTags
      label="Topics"
      description="Enter a topic and press Enter to add it."
      value={topics}
      onValueChange={setTopics}
      placeholder="Enter a topic"
    />
  );
}
