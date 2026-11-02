import { Card, Grid, Link, Text } from '@fastsprout/reacd';
import type { DesignTemplate } from '@fastsprout/reacd';
import { LivePreview } from './preview.js';

export function HomeTemplates({
  appearance,
  design,
}: {
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
}) {
  return (
    <Grid columns={3}>
      <Card label="Counter template">
        <Text role="subheadline">Counter</Text>
        <LivePreview
          appearance={appearance}
          design={design}
          entry={{ type: 'preview', key: 'home-counter', example: 'Counter' }}
        />
        <Link href="/examples/counter/" label="Counter source" />
      </Card>
      <Card label="Contact form template">
        <Text role="subheadline">Contact form</Text>
        <LivePreview
          appearance={appearance}
          design={design}
          entry={{ type: 'preview', key: 'home-contact', example: 'ContactForm' }}
        />
        <Link href="/examples/contact-form/" label="Contact form source" />
      </Card>
      <Card label="Orders dashboard template">
        <Text role="subheadline">Orders dashboard</Text>
        <LivePreview
          appearance={appearance}
          design={design}
          entry={{ type: 'preview', key: 'home-orders', example: 'OrdersDashboard' }}
        />
        <Link href="/examples/orders-dashboard/" label="Orders dashboard source" />
      </Card>
    </Grid>
  );
}
