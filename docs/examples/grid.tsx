import { Card, Grid, Text } from '@fastsprout/reacd';

export function GridExample() {
  return (
    <Grid columns={3} spacing="medium">
      <Card>
        <Text role="subheadline">Orders overview</Text>
        <Text>Review current orders and delivery status.</Text>
      </Card>
      <Card>
        <Text role="subheadline">Customer overview</Text>
        <Text>Keep customer details in one workspace.</Text>
      </Card>
      <Card>
        <Text role="subheadline">Delivery overview</Text>
        <Text>Track shipments and pending deliveries.</Text>
      </Card>
    </Grid>
  );
}
