import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  Banner,
  Button,
  Empty,
  Error,
  ReacdProvider,
  Text,
  Theme,
} from '@fastsprout/reacd';
import { shadcnAdapter } from './shadcn.adapter.js';

it('renders SDK components through the native registry', async () => {
  const action = vi.fn();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Theme defaults={{ Text: { role: 'caption' } }}>
        <Text>Caption</Text>
        <Button label="Save" onPress={action} />
      </Theme>
    </ReacdProvider>,
  );
  expect(screen.getByText('Caption').className).toContain('text-sm');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(action).toHaveBeenCalledWith();
});

it('registers native SDK empty, error and banner compositions', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Empty title="No projects" />
      <Error statusCode={404} title="Project not found" />
      <Banner title="Maintenance" open onOpenChange={vi.fn()} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'No projects' })).toHaveAttribute(
    'data-slot',
    'empty',
  );
  expect(screen.getByText('Project not found')).toBeVisible();
  expect(screen.getByText('Maintenance')).toBeVisible();
});
