import { Card, Text } from '@fastsprout/reacd';
import { CalendarExample } from '../calendar.js';
import { InputDateExample } from '../input-date.js';

export function CalendarCard() {
  return (
    <Card label="Dates and calendar">
      <Text role="subheadline">Plan a delivery</Text>
      <CalendarExample />
      <InputDateExample />
    </Card>
  );
}
