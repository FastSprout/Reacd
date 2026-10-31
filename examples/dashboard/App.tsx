import { browserAdapter } from '../../test-support/browser/adapter.js';
import { atom, useAtom } from 'jotai';
import {
  Button,
  Input,
  Page,
  ReacdProvider,
  Table,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const queryAtom = atom('');
const openOnlyAtom = atom(false);
const ORDERS = [
  { customer: 'Ada', status: 'Open' },
  { customer: 'Mina', status: 'Paid' },
  { customer: 'Lin', status: 'Open' },
];

function OrdersDashboard() {
  const [query, setQuery] = useAtom(queryAtom);
  const [openOnly, setOpenOnly] = useAtom(openOnlyAtom);
  const rows = ORDERS.filter(
    (order) =>
      order.customer.toLowerCase().includes(query.toLowerCase()) &&
      (!openOnly || order.status === 'Open'),
  ).map((order) => [order.customer, order.status]);
  return (
    <Page title="Orders dashboard" subtitle="Filter local sample orders.">
      <VStack>
        <Input label="Filter orders" value={query} onValueChange={setQuery} />
        <Toggle
          label="Open orders only"
          checked={openOnly}
          onCheckedChange={setOpenOnly}
        />
        <Button
          label="Clear filters"
          onPress={() => {
            setQuery('');
            setOpenOnly(false);
          }}
        />
        <Text>{`Visible orders: ${rows.length}`}</Text>
        <Table
          caption="Sample orders"
          columns={['Customer', 'Status']}
          rows={rows}
          emptyMessage="No matching orders."
        />
      </VStack>
    </Page>
  );
}

export function App() {
  return (
    <ReacdProvider adapter={browserAdapter}>
      <OrdersDashboard />
    </ReacdProvider>
  );
}
