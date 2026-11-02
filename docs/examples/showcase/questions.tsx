import { atom, useAtom } from 'jotai';
import { Accordion, Card, Text } from '@fastsprout/reacd';

const openAtom = atom<readonly string[]>([]);
const QUESTIONS = [
  {
    value: 'design',
    label: 'Can I use my own design?',
    content: <Text>Choose an adapter and provide your design tokens.</Text>,
  },
  {
    value: 'state',
    label: 'Where does application state live?',
    content: <Text>Jotai stores belong to your application.</Text>,
  },
];

export function QuestionsCard() {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <Card label="Common questions">
      <Text role="subheadline">Built around your application</Text>
      <Accordion
        label="About reacd"
        value={open}
        onValueChange={setOpen}
        mode="multiple"
        items={QUESTIONS}
      />
    </Card>
  );
}
