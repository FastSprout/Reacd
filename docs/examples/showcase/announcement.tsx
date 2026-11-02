import { atom, useAtom } from 'jotai';
import { Banner, Button, Card, Link, Text } from '@fastsprout/reacd';

const visibleAtom = atom(true);

export function AnnouncementCard() {
  const [visible, setVisible] = useAtom(visibleAtom);
  return (
    <Card label="Product update">
      <Text role="subheadline">Product update</Text>
      <Banner
        title="Workspace update"
        description="Keep your team informed."
        open={visible}
        onOpenChange={setVisible}
        dismissible
        closeLabel="Dismiss update"
        actions={<Link href="/components/banner/" label="Read the banner guide" />}
      />
      {!visible && <Button label="Restore update" onPress={() => setVisible(true)} />}
    </Card>
  );
}
