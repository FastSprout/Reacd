import { COMPOSITION_HOST_EVENTS } from './composition-events.js';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popover,
  ReacdProvider,
  Section,
  Select,
  Tabs,
  Text,
  Toggle,
  VStack,
} from '../../src/index.js';
import { mountApplication } from '../../src/state/bootstrap.js';

const compactAtom = atom(false);
const disabledAtom = atom(false);
const submittingAtom = atom(false);
const roleAtom = atom('reader');
const editsAtom = atom(0);
const selectedAtom = atom('first');
const dialogAtom = atom(false);
const retainedAtom = atom('');
const sharedAtom = atom('shared');
const popoverAtom = atom(false);
const options = [
  { value: 'reader', label: 'Reader' },
  { value: 'admin', label: 'Admin' },
];

function NativeAncestryCase() {
  return (
    <form aria-label="Trusted host form">
      <Form label="Rejected nested form" onSubmit={() => undefined}>
        <Text>Nested controls must not mount.</Text>
      </Form>
    </form>
  );
}

function CompositionSafety() {
  const [compact, setCompact] = useAtom(compactAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [submitting, setSubmitting] = useAtom(submittingAtom);
  const [role, setRole] = useAtom(roleAtom);
  const [edits, setEdits] = useAtom(editsAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [dialog, setDialog] = useAtom(dialogAtom);
  const [retained, setRetained] = useAtom(retainedAtom);
  const [shared, setShared] = useAtom(sharedAtom);
  const [popover, setPopover] = useAtom(popoverAtom);
  useEffect(() => {
    const disable = () => setDisabled(true);
    const submit = () => setSubmitting(true);
    const first = () => setSelected('first');
    const explicit = () => setShared('explicit');
    window.addEventListener(COMPOSITION_HOST_EVENTS.disableForm, disable);
    window.addEventListener(COMPOSITION_HOST_EVENTS.submitForm, submit);
    window.addEventListener(COMPOSITION_HOST_EVENTS.firstTab, first);
    window.addEventListener(COMPOSITION_HOST_EVENTS.explicitTab, explicit);
    return () => {
      window.removeEventListener(COMPOSITION_HOST_EVENTS.disableForm, disable);
      window.removeEventListener(COMPOSITION_HOST_EVENTS.submitForm, submit);
      window.removeEventListener(COMPOSITION_HOST_EVENTS.firstTab, first);
      window.removeEventListener(COMPOSITION_HOST_EVENTS.explicitTab, explicit);
    };
  }, [setDisabled, setSubmitting, setSelected, setShared]);
  return (
    <ReacdProvider templateId={compact ? 'erp-compact' : 'saas-modern-light'}>
      <App direction="rtl">
        <VStack>
          <Toggle
            label="Compact fixture"
            checked={compact}
            onCheckedChange={setCompact}
          />
          <Section title="Protected form">
            <Toggle
              label="Disable settings form"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
            <Toggle
              label="Submit settings form"
              checked={submitting}
              onCheckedChange={setSubmitting}
            />
            <Button label="Supply admin from host" onPress={() => setRole('admin')} />
            <Form
              label="Settings"
              disabled={disabled}
              submitting={submitting}
              onSubmit={() => undefined}
            >
              <Select
                label="Role"
                name="role"
                value={role}
                items={options}
                onValueChange={(next) => {
                  setRole(next);
                  setEdits((count) => count + 1);
                }}
              />
            </Form>
            <Text>{`Accepted role edits: ${edits}`}</Text>
          </Section>
          <Section title="Retained tab portals">
            <Toggle
              label="Keep dialog open"
              checked={dialog}
              onCheckedChange={setDialog}
            />
            <Tabs
              label="Retained panels"
              value={selected}
              onValueChange={setSelected}
              items={[
                { value: 'first', label: 'First', content: <Text>First panel</Text> },
                {
                  value: 'second',
                  label: 'Second',
                  content: (
                    <Modal
                      title="Retained dialog"
                      description="Retained dialog content"
                      open={dialog}
                      onOpenChange={setDialog}
                      retainContent
                    >
                      <Input
                        label="Retained field"
                        value={retained}
                        onValueChange={setRetained}
                      />
                    </Modal>
                  ),
                },
              ]}
            />
            <Text>{`Dialog host intent: ${String(dialog)}`}</Text>
          </Section>
          <Section title="Shared tab portal">
            <Toggle
              label="Keep shared popup open"
              checked={popover}
              onCheckedChange={setPopover}
            />
            <Tabs
              label="Shared panels"
              value={shared}
              onValueChange={setShared}
              items={[
                { value: 'shared', label: 'Shared' },
                {
                  value: 'explicit',
                  label: 'Explicit',
                  content: <Text>Own panel</Text>,
                },
              ]}
            >
              <Popover
                title="Shared popup"
                description="Shared fallback popup"
                triggerLabel="Open shared popup"
                open={popover}
                onOpenChange={setPopover}
              >
                <Button label="Shared popup action" onPress={() => undefined} />
              </Popover>
            </Tabs>
            <Text>{`Shared popup intent: ${String(popover)}`}</Text>
          </Section>
          <Section title="Native ancestry rejection">
            <NativeAncestryCase />
          </Section>
        </VStack>
      </App>
    </ReacdProvider>
  );
}

mountApplication(CompositionSafety);
