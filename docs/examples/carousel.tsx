import { atom, useAtom } from 'jotai';
import { Carousel, Text } from '@fastsprout/reacd';

const slideAtom = atom(0);

export function CarouselExample() {
  const [slide, setSlide] = useAtom(slideAtom);

  return (
    <Carousel
      label="Getting started"
      value={slide}
      onValueChange={setSlide}
      items={[
        { id: 'team', label: 'Team', children: <Text>Invite your team</Text> },
        { id: 'work', label: 'Work', children: <Text>Organize your work</Text> },
        { id: 'progress', label: 'Progress', children: <Text>Track progress</Text> },
      ]}
    />
  );
}
