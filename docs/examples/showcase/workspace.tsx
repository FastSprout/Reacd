import { atom, useAtom } from 'jotai';
import { Card, NavigationMenu, Text } from '@fastsprout/reacd';

const sectionAtom = atom('Dashboard');
const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'projects', label: 'Projects' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'settings', label: 'Settings' },
];

export function WorkspaceCard() {
  const [section, setSection] = useAtom(sectionAtom);
  return (
    <Card label="Workspace navigation">
      <Text role="subheadline">Workspace</Text>
      <NavigationMenu
        label="Workspace sections"
        orientation="vertical"
        items={SECTIONS.map((item) => ({
          ...item,
          active: section === item.label,
          onPress: () => setSection(item.label),
        }))}
      />
      <Text role="caption">{`Workspace view: ${section}.`}</Text>
    </Card>
  );
}
