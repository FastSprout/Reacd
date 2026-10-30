import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageCompositionExamples } from './page-composition-examples.js';

it('composes the page primitives through their public TSX declarations', () => {
  render(
    <ReacdProvider>
      <PageCompositionExamples />
    </ReacdProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Page composition' })).toBeVisible();
  expect(
    screen.getByRole('complementary', { name: 'Page composition navigation' }),
  ).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('scopes actual RTL direction without losing the page state', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <ReacdProvider>
      <PageCompositionExamples />
    </ReacdProvider>,
  );
  const query = screen.getByLabelText('Page body query');
  await user.type(query, 'Retained');
  await user.click(screen.getByRole('switch', { name: 'Page composition RTL' }));
  expect(container.querySelector('[dir="rtl"]')).toBeInTheDocument();
  expect(query).toHaveValue('Retained');
  await user.click(screen.getByRole('switch', { name: 'Page composition RTL' }));
  expect(container.querySelector('[dir="rtl"]')).not.toBeInTheDocument();
});
