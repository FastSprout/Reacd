import { atom, useAtom } from 'jotai';
import {
  Avatar,
  Button,
  Modal,
  Section,
  Select,
  Text,
  Toggle,
  Tooltip,
  VStack,
} from '@fastsprout/reacd';

const openAtom = atom(false);
const disabledAtom = atom(false);
const anchorDisabledAtom = atom(false);
const arrowAtom = atom(true);
const longAtom = atom(false);
const placementAtom = atom('top');
const dialogAtom = atom(false);
const countAtom = atom(0);
const HINT = 'Runs a local sample action without sending data.';
const LONG_HINT_REPETITIONS = 24;
const LONG_HINT = HINT + ' Long_unbroken_hint_'.repeat(LONG_HINT_REPETITIONS);
const PLACEMENTS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'inline-start', label: 'Inline start' },
  { value: 'inline-end', label: 'Inline end' },
];
export function TooltipExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [anchorDisabled, setAnchorDisabled] = useAtom(anchorDisabledAtom);
  const [arrow, setArrow] = useAtom(arrowAtom);
  const [long, setLong] = useAtom(longAtom);
  const [placement, setPlacement] = useAtom(placementAtom);
  const [dialog, setDialog] = useAtom(dialogAtom);
  const [count, setCount] = useAtom(countAtom);
  return (
    <Section title="Tooltip preview">
      <VStack>
        <Text>Tooltips supplement labels. Essential information stays visible.</Text>
        <Select
          label="Tooltip placement"
          value={placement}
          items={PLACEMENTS}
          onValueChange={setPlacement}
        />
        <Toggle label="Controlled hint open" checked={open} onCheckedChange={setOpen} />
        <Toggle
          label="Disable tooltip"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle
          label="Disable tooltip child"
          checked={anchorDisabled}
          onCheckedChange={setAnchorDisabled}
        />
        <Toggle label="Tooltip arrow" checked={arrow} onCheckedChange={setArrow} />
        <Toggle label="Long tooltip text" checked={long} onCheckedChange={setLong} />
        <Tooltip
          text={long ? LONG_HINT : HINT}
          open={open}
          onOpenChange={setOpen}
          disabled={disabled}
          arrow={arrow}
          shortcuts={['Control', 'S']}
          placement={
            placement === 'bottom'
              ? 'bottom'
              : placement === 'inline-start'
                ? 'inline-start'
                : placement === 'inline-end'
                  ? 'inline-end'
                  : 'top'
          }
        >
          <Button
            label="Run annotated action"
            disabled={anchorDisabled}
            onPress={() => setCount(count + 1)}
          />
        </Tooltip>
        <Text>{`Annotated action count: ${count}`}</Text>
        <Tooltip text="Example placeholder identity" delay="none">
          <Avatar name="Example Reader" />
        </Tooltip>
        <Modal
          title="Tooltip dialog"
          description="Retained popup lifecycle example."
          open={dialog}
          onOpenChange={setDialog}
          triggerLabel="Open tooltip dialog"
          closeLabel="Close tooltip dialog"
          retainContent
        >
          <Tooltip text="Hint inside the dialog" delay="none">
            <Button label="Dialog sample action" onPress={() => setCount(count + 1)} />
          </Tooltip>
        </Modal>
      </VStack>
    </Section>
  );
}
