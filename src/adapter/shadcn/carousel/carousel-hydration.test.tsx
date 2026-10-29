import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { CarouselExample } from '../../../../docs/examples/carousel.js';

it('hydrates slide forms and isolates request-local application state', async () => {
  const user = userEvent.setup();
  const tree = (
    <ReacdProvider>
      <CarouselExample />
    </ReacdProvider>
  );
  const server = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = server;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const draft = screen.getByRole('textbox', { name: 'Profile slide draft' });
  await user.clear(draft);
  await user.type(draft, 'Client edit');
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  await user.click(screen.getByRole('button', { name: 'Previous slide' }));
  expect(draft).toHaveValue('Client edit');
  expect(renderToString(tree)).toContain('value="Draft profile"');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
