import { atom, useAtom } from 'jotai';
import { App, Input, Marquee, Toggle, VStack } from '@fastsprout/reacd';
const pausedAtom = atom(true);
const readonlyAtom = atom(false);
const rtlAtom = atom(false);
const backwardAtom = atom(false);
const fastAtom = atom(false);
const emptyAtom = atom(false);
const textAtom = atom('Notices remain readable without motion.');
const TEXT_LIMIT = 500;
export function MarqueeExample() {
  const [paused, setPaused] = useAtom(pausedAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [backward, setBackward] = useAtom(backwardAtom);
  const [fast, setFast] = useAtom(fastAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [text, setText] = useAtom(textAtom);
  const items = [
    { id: 'content', label: text.trim() === '' ? 'Notice content' : text },
    { id: 'control', label: 'Pause movement or open the complete text.' },
  ];
  return (
    <VStack>
      <Input
        label="Marquee notice text"
        value={text}
        onValueChange={(next: string) => setText(next.slice(0, TEXT_LIMIT))}
      />
      <Toggle label="Right to left marquee" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Marquee
            label="Reference notices"
            items={empty ? [] : items}
            paused={paused}
            onPausedChange={setPaused}
            direction={backward ? 'backward' : 'forward'}
            pace={fast ? 'fast' : 'normal'}
            readOnly={readOnly}
          />
          <Toggle
            label="Readonly marquee"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Backward marquee"
            checked={backward}
            onCheckedChange={setBackward}
          />
          <Toggle label="Fast marquee" checked={fast} onCheckedChange={setFast} />
          <Toggle label="Empty marquee" checked={empty} onCheckedChange={setEmpty} />
        </VStack>
      </App>
    </VStack>
  );
}
