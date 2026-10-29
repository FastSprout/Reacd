import { atom, useAtom } from 'jotai';
import {
  Button,
  Grid,
  Input,
  Kbd,
  Modal,
  Popover,
  Section,
  Select,
  Text,
  Toggle,
  Tooltip,
  VStack,
} from 'reacd';

const openAtom = atom(false);
const modeAtom = atom('click');
const modalAtom = atom(false);
const dismissibleAtom = atom(true);
const retainedAtom = atom(true);
const disabledAtom = atom(false);
const arrowAtom = atom(true);
const placementAtom = atom('bottom');
const alignAtom = atom('center');
const longAtom = atom(false);
const draftAtom = atom('');
const savedAtom = atom('No local draft saved.');
const nestedAtom = atom(false);
const dialogAtom = atom(false);
const dialogPopoverAtom = atom(false);
const selectionAtom = atom('alpha');
const LONG_REPETITIONS = 28;
const LONG_TEXT = 'Long_unbroken_popover_content_'.repeat(LONG_REPETITIONS);
const OPTIONS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
];
const MODES = [
  { value: 'click', label: 'Click' },
  { value: 'hover', label: 'Hover' },
];
const PLACEMENTS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'inline-start', label: 'Inline start' },
  { value: 'inline-end', label: 'Inline end' },
];
const ALIGNS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
];
export function PopoverExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [mode, setMode] = useAtom(modeAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [dismissible, setDismissible] = useAtom(dismissibleAtom);
  const [retained, setRetained] = useAtom(retainedAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [arrow, setArrow] = useAtom(arrowAtom);
  const [placement, setPlacement] = useAtom(placementAtom);
  const [align, setAlign] = useAtom(alignAtom);
  const [long, setLong] = useAtom(longAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  const [nested, setNested] = useAtom(nestedAtom);
  const [dialog, setDialog] = useAtom(dialogAtom);
  const [dialogPopover, setDialogPopover] = useAtom(dialogPopoverAtom);
  const [selection, setSelection] = useAtom(selectionAtom);
  return (
    <Section title="Popover preview">
      <VStack>
        <Text>
          Interactive popovers use the same typed fields and actions as a page.
        </Text>
        <Grid columns={3}>
          <Select
            label="Popover mode"
            value={mode}
            items={MODES}
            onValueChange={setMode}
          />
          <Select
            label="Popover placement"
            value={placement}
            items={PLACEMENTS}
            onValueChange={setPlacement}
          />
          <Select
            label="Popover alignment"
            value={align}
            items={ALIGNS}
            onValueChange={setAlign}
          />
          <Toggle label="Modal popover" checked={modal} onCheckedChange={setModal} />
          <Toggle
            label="Dismissible popover"
            checked={dismissible}
            onCheckedChange={setDismissible}
          />
          <Toggle
            label="Retain popover content"
            checked={retained}
            onCheckedChange={setRetained}
          />
          <Toggle
            label="Disable popover trigger"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle label="Popover arrow" checked={arrow} onCheckedChange={setArrow} />
          <Toggle
            label="Long popover content"
            checked={long}
            onCheckedChange={setLong}
          />
        </Grid>
        <Popover
          title="Draft details"
          description="Changes stay in this local preview."
          triggerLabel="Open details popover"
          closeLabel="Close details popover"
          open={open}
          onOpenChange={setOpen}
          disabled={disabled}
          mode={mode === 'hover' ? 'hover' : 'click'}
          modal={modal}
          dismissible={dismissible}
          retainContent={retained}
          arrow={arrow}
          placement={
            placement === 'top'
              ? 'top'
              : placement === 'inline-start'
                ? 'inline-start'
                : placement === 'inline-end'
                  ? 'inline-end'
                  : 'bottom'
          }
          align={align === 'start' ? 'start' : align === 'end' ? 'end' : 'center'}
          footer={
            <Button
              label="Save local draft"
              onPress={() => setSaved(`Saved locally: ${draft}`)}
            />
          }
        >
          <VStack>
            <Input label="Popover draft" value={draft} onValueChange={setDraft} />
            <Select
              label="Popover choice"
              value={selection}
              items={OPTIONS}
              onValueChange={setSelection}
            />
            <Kbd value="escape" />
            <Tooltip text="This action only updates the local preview." delay="none">
              <Button
                label="Annotated save"
                onPress={() => setSaved(`Saved locally: ${draft}`)}
              />
            </Tooltip>
            <Popover
              title="Nested details"
              triggerLabel="Open nested popover"
              open={nested}
              onOpenChange={setNested}
              closeLabel="Close nested popover"
            >
              <Text>Nested content has its own focus and dismissal scope.</Text>
            </Popover>
            {long && <Text>{LONG_TEXT}</Text>}
          </VStack>
        </Popover>
        <Text>{saved}</Text>
        <Button
          label="Popover outside action"
          onPress={() => setSaved('Outside action ran.')}
        />
        <Modal
          title="Popover parent dialog"
          description="Nested portal and focus example."
          triggerLabel="Open popover parent dialog"
          closeLabel="Close popover parent dialog"
          open={dialog}
          onOpenChange={setDialog}
          retainContent
        >
          <Popover
            title="Dialog details"
            triggerLabel="Open dialog popover"
            closeLabel="Close dialog popover"
            open={dialogPopover}
            onOpenChange={setDialogPopover}
            retainContent
          >
            <Select
              label="Dialog popover choice"
              value={selection}
              items={OPTIONS}
              onValueChange={setSelection}
            />
            <Tooltip text="Dialog popover hint" delay="none">
              <Button
                label="Dialog popover action"
                onPress={() => setSaved('Dialog popover action ran.')}
              />
            </Tooltip>
            <Button label="Hide parent dialog" onPress={() => setDialog(false)} />
          </Popover>
        </Modal>
      </VStack>
    </Section>
  );
}
