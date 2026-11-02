import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ShadcnChart } from './chart.adapter.js';

it('hydrates native charts and semantic values without recoveries', () => {
  const content = <ShadcnChart label="Counts" description="Daily count"
    categories={[{ id: 'day', label: 'Today' }]}
    series={[{ id: 'count', label: 'Count', values: [2] }]} />;
  const html = renderToString(content);
  expect(html).toContain('role="img"');
  expect(html).toContain('Today');
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(content, { container, hydrate: true,
    onRecoverableError: (error) => errors.push(error) });
  expect(screen.getByRole('img', { name: 'Counts' }))
    .toHaveAccessibleDescription('Daily count');
  expect(screen.getByRole('table', { name: 'Counts data' })).toHaveTextContent('2');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
