import { atom, useAtom } from 'jotai';
import { Card, Checkbox, Switch, Text } from '@fastsprout/reacd';

const summaryAtom = atom(true);
const alertsAtom = atom(false);

export function PreferencesCard() {
  const [summary, setSummary] = useAtom(summaryAtom);
  const [alerts, setAlerts] = useAtom(alertsAtom);
  return (
    <Card label="Notification preferences">
      <Text role="subheadline">Notifications</Text>
      <Text role="caption">Choose what reaches your inbox.</Text>
      <Checkbox label="Weekly summary" checked={summary} onCheckedChange={setSummary} />
      <Switch label="Activity alerts" checked={alerts} onCheckedChange={setAlerts} />
      <Text role="caption">Preferences stay in this preview.</Text>
    </Card>
  );
}
