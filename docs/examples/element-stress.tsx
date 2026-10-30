import { atom, useAtom } from 'jotai';
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Progress,
  Text,
  VStack,
} from '@fastsprout/reacd';
const DEFAULT_LABEL = 'Content stays inside its component';
const LABEL_LIMIT = 500;
const labelAtom = atom(DEFAULT_LABEL);
const actionsAtom = atom(0);
const openAtom = atom(true);

export function ElementStressExample() {
  const [draft, setDraft] = useAtom(labelAtom);
  const [actions, setActions] = useAtom(actionsAtom);
  const [open, setOpen] = useAtom(openAtom);
  const label = draft.trim() === '' ? DEFAULT_LABEL : draft;
  const activate = () => setActions((previous) => previous + 1);
  return (
    <VStack>
      <Input
        label="Element stress text"
        value={draft}
        onValueChange={(value) => setDraft(value.slice(0, LABEL_LIMIT))}
      />
      <Card
        label="Resilient element content"
        header={<Text>{label}</Text>}
        footer={
          <Button
            label={label}
            onPress={activate}
            leadingIcon="download"
            trailingIcon="external"
          />
        }
      >
        <Badge label={label} intent="primary" leadingIcon="check" />
        <Icon name="info" label={label} />
        <Alert
          title={label}
          message={label}
          intent="warning"
          open={open}
          onOpenChange={setOpen}
          actions={[
            { id: 'accept', label: 'Accept stress example', onPress: activate },
          ]}
        />
        <Progress label={label} value={25} />
      </Card>
      <Text>{`Stress actions: ${actions}`}</Text>
    </VStack>
  );
}
