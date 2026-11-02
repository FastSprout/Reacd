import { Card, Grid, Text } from '@fastsprout/reacd';

export function GridExample() {
  return (
    <Grid columns={3} spacing="medium">
      <Card>
        <Text role="headline">Orders overview</Text>
      </Card>
      <Card>
        <Text role="headline">Customer overview</Text>
      </Card>
      <Card>
        <Text role="headline">Delivery overview</Text>
      </Card>
    </Grid>
  );
}
