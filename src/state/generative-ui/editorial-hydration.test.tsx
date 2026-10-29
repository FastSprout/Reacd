import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

const declaration = {
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'BlogPost',
    title: 'Hydrated article',
    date: '2024-02-29',
    children: [{ type: 'Text', content: 'Explicit calendar date' }],
  },
};

it('hydrates stable calendar strings without ambient locale or clock output', () => {
  const container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderToString(<GenerativeUI document={declaration} />);
  const errors: unknown[] = [];
  const view = render(<GenerativeUI document={declaration} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(errors).toEqual([]);
  expect(screen.getByText('2024-02-29')).toHaveAttribute('datetime', '2024-02-29');
  view.unmount();
  container.remove();
});
