import { atom, useAtom } from 'jotai';
import { App, Banner, Button, Input, Section, Text, Toggle, VStack } from 'reacd';

const visibleAtom = atom(true);
const dismissibleAtom = atom(true);
const savesAtom = atom(0);
const titleAtom = atom('Scheduled maintenance');
const descriptionAtom = atom('Save your work first.');
const rtlAtom = atom(false);

export function BannerExample() {
  const [visible, setVisible] = useAtom(visibleAtom);
  const [dismissible, setDismissible] = useAtom(dismissibleAtom);
  const [saves, setSaves] = useAtom(savesAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Maintenance banner preview">
      <VStack>
        <Input label="Banner title" value={title} onValueChange={setTitle} />
        <Input
          label="Banner description"
          value={description}
          onValueChange={setDescription}
        />
        <Toggle
          label="Show maintenance banner"
          checked={visible}
          onCheckedChange={setVisible}
        />
        <Toggle
          label="Allow banner dismissal"
          checked={dismissible}
          onCheckedChange={setDismissible}
        />
        <Toggle label="Right to left banner" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <Banner
            title={title.trim() === '' ? 'Scheduled maintenance' : title}
            description={description}
            intent="warning"
            open={visible}
            onOpenChange={setVisible}
            dismissible={dismissible}
            actions={
              <Button label="Save example work" onPress={() => setSaves(saves + 1)} />
            }
          />
        </App>
        <Text>{`Example saves: ${saves}`}</Text>
      </VStack>
    </Section>
  );
}
