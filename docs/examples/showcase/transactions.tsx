import { Card, Table, Text } from '@fastsprout/reacd';

export function TransactionsCard() {
  return (
    <Card label="Recent transactions">
      <Text role="subheadline">Recent transactions</Text>
      <Text role="caption">Your latest account activity.</Text>
      <Table
        caption="Recent account activity"
        columns={['Description', 'Amount']}
        rows={[
          ['Project payout', '+$2,400.00'],
          ['Coffee shop', '-$8.50'],
          ['Groceries', '-$64.20'],
          ['Streaming subscription', '-$19.99'],
        ]}
      />
    </Card>
  );
}
