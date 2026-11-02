import { Card, Chart, Text } from '@fastsprout/reacd';

export function VisitorsCard() {
  return (
    <Card label="Visitors">
      <Text role="subheadline">Visitors</Text>
      <Text role="display">4,182</Text>
      <Chart
        label="Weekly visitors"
        description="Visits during the last seven days."
        kind="line"
        categories={[
          { id: 'mon', label: 'Mon' },
          { id: 'tue', label: 'Tue' },
          { id: 'wed', label: 'Wed' },
          { id: 'thu', label: 'Thu' },
          { id: 'fri', label: 'Fri' },
          { id: 'sat', label: 'Sat' },
          { id: 'sun', label: 'Sun' },
        ]}
        series={[
          {
            id: 'visits',
            label: 'Visits',
            values: [420, 580, 510, 720, 690, 612, 650],
          },
        ]}
      />
    </Card>
  );
}
