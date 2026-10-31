import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Button, Card, Icon, Progress, ReacdProvider, Text } from '../../../index.js';
import { CardExample } from '../../../../docs/examples/card.js';

it('hydrates slots and preserves state across templates', async () => {
  const user = userEvent.setup();
  const container = document.createElement('div');
  const tree = (
    <ReacdProvider adapter={shadcnAdapter}>
      <CardExample />
    </ReacdProvider>
  );
  container.innerHTML = renderToString(tree);
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  await user.click(screen.getByRole('button', { name: 'Review card details' }));
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter} templateId="erp-compact">
      <CardExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Review requests: 1')).toBeInTheDocument();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('renders closed icon/button/progress content in all server-side card slots', () => {
  const html = renderToString(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card
        label="Server card"
        header={<Icon name="info" label="Information" />}
        footer={<Button label="Review" onPress={() => undefined} leadingIcon="check" />}
      >
        <Text>Server-rendered body</Text>
        <Progress label="Server progress" value={50} max={200} />
      </Card>
    </ReacdProvider>,
  );
  expect(html).toContain('Server-rendered body');
  expect(html).toContain('aria-label="Information"');
  expect(html).toContain('25%');
});
