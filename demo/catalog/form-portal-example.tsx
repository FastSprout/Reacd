import { atom, useAtom } from 'jotai';
import { AuthForm, Form, Modal, SubmitButton, Text } from 'reacd';

const openAtom = atom(false);
const outerCountAtom = atom(0);
const innerCountAtom = atom(0);

export function FormPortalExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [outerCount, setOuterCount] = useAtom(outerCountAtom);
  const [innerCount, setInnerCount] = useAtom(innerCountAtom);
  return (
    <Form
      label="Outer portal example"
      onSubmit={() => setOuterCount((count) => count + 1)}
    >
      <Text>Local portal submission example. No data is sent.</Text>
      <Modal
        title="Local portal form"
        description="Separate native form boundary"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Open portal form example"
      >
        <AuthForm
          label="Inner portal example"
          submitLabel="Submit inner portal"
          onSubmit={() => setInnerCount((count) => count + 1)}
        >
          <Text>Submitting this form does not submit the outer form.</Text>
        </AuthForm>
      </Modal>
      <SubmitButton label="Submit outer portal" />
      <Text>{`Outer submissions: ${outerCount}`}</Text>
      <Text>{`Inner submissions: ${innerCount}`}</Text>
    </Form>
  );
}
