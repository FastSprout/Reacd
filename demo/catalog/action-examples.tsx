import { SpinnerExample } from '../../docs/examples/spinner.js';
import { LocaleSelectExample } from '../../docs/examples/locale-select.js';
import { ColorModeExample } from '../../docs/examples/color-mode.js';
import { atom, useAtom } from 'jotai';
import { ModalExample } from '../../docs/examples/modal.js';
import { BannerExample } from '../../docs/examples/banner.js';
import { ElementFoundationsExample } from '../../docs/examples/element-foundations.js';
import {
  Alert,
  Badge,
  Button,
  HStack,
  Progress,
  Section,
  Spinner,
  Text,
  VStack,
} from 'reacd';

const countAtom = atom(0);
const PROGRESS_STEP = 10;
const PROGRESS_MAX = 100;

export function ActionExamples() {
  const [count, setCount] = useAtom(countAtom);
  const progress = Math.min(count * PROGRESS_STEP, PROGRESS_MAX);
  const activate = () => setCount((previous) => previous + 1);
  return (
    <Section
      title="Actions and feedback"
      description="Actions change state. Disabled controls remain inactive."
    >
      <VStack>
        <LocaleSelectExample />
        <ColorModeExample />
        <HStack>
          <Button label="Activate example" onPress={activate} />
          <Button
            label="Reset activations"
            intent="secondary"
            onPress={() => setCount(0)}
          />
          <Button label="Disabled action" disabled onPress={activate} />
        </HStack>
        <Badge label={`${count} activations`} />
        <Progress label="Example completion" value={progress} />
        <Alert
          title={count === 0 ? 'Ready' : 'Action received'}
          intent="info"
          message={
            count === 0
              ? 'Activate the example to update its state.'
              : `The example received ${count} activations.`
          }
        />
        <Text role="caption">The following is an explicit loading example.</Text>
        <Spinner label="Example loading state" />
        <ModalExample />
        <BannerExample />
        <ElementFoundationsExample />
      </VStack>
      <SpinnerExample />
    </Section>
  );
}
