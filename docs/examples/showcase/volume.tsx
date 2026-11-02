import { atom, useAtom } from 'jotai';
import { Card, Slider, Text } from '@fastsprout/reacd';

const volumeAtom = atom(40);
const MINIMUM = 0;
const MAXIMUM = 100;

export function VolumeCard() {
  const [volume, setVolume] = useAtom(volumeAtom);
  return (
    <Card label="Audio preferences">
      <Text role="subheadline">Make yourself comfortable</Text>
      <Slider
        label="Playback volume"
        value={volume}
        min={MINIMUM}
        max={MAXIMUM}
        onValueChange={setVolume}
      />
      <Text role="caption">{`Volume: ${volume}%`}</Text>
    </Card>
  );
}
