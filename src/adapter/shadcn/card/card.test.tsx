import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button, Card, ReacdProvider, Text } from '../../../index.js';

it('renders working actions in validated header/body/footer slots', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card
        label="Delivery"
        header={<Text>Header</Text>}
        footer={<Button label="Review" onPress={action} />}
        spacing="large"
      >
        <Text>Body</Text>
      </Card>
    </ReacdProvider>,
  );
  const card = screen.getByRole('region', { name: 'Delivery' });
  expect(card).toHaveTextContent('HeaderBodyReview');
  await user.click(screen.getByRole('button', { name: 'Review' }));
  expect(action).toHaveBeenCalledOnce();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card>
        <Text>Simple card</Text>
      </Card>
    </ReacdProvider>,
  );
  expect(screen.queryByRole('region', { name: 'Delivery' })).toBeNull();
  expect(view.container.querySelector('[data-slot="reacd-card-header"]')).toBeNull();
  expect(view.container.querySelector('[data-slot="reacd-card-footer"]')).toBeNull();
});

it('omits empty slot wrappers while preserving rendered zero values', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card header={[]} footer={false} />
    </ReacdProvider>,
  );
  expect(view.container.querySelector('[data-slot="reacd-card-header"]')).toBeNull();
  expect(view.container.querySelector('[data-slot="reacd-card-footer"]')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card header="" footer={null} />
    </ReacdProvider>,
  );
  expect(view.container.querySelector('[data-slot="reacd-card-header"]')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Card header={0} />
    </ReacdProvider>,
  );
  expect(
    view.container.querySelector('[data-slot="reacd-card-header"]'),
  ).toHaveTextContent('0');
});
