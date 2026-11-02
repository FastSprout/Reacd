import { render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { ShadcnChart } from './chart.adapter.js';
import { ShadcnSurface } from '../surface/surface.adapter.js';
import { templates } from '../../../schema/design/templates.schema.js';

it('uses foreground patterns with the native inverted theme', async () => {
  const restore = installLayout(640);
  const template = templates['saas-modern-light'];
  try {
    const view = render(
      <ShadcnSurface templateId="inverse" template={{ ...template,
        colors: { ...template.colors, canvas: '#000000', surface: '#000000',
          text: '#ffffff' } }}>
        <ShadcnChart label="Counts" description="Compared totals" kind="bar"
          categories={[{ id: 'a', label: 'First' }]}
          series={[{ id: 'one', label: 'One', values: [2] },
            { id: 'two', label: 'Two', values: [3] }]} />
      </ShadcnSurface>,
    );
    const graphic = screen.getByRole('img');
    await waitFor(() => expect(graphic.querySelectorAll('.recharts-bar'))
      .toHaveLength(2));
    const surface = view.container.firstElementChild;
    if (!(surface instanceof HTMLElement)) throw new Error('Missing native surface.');
    expect(surface.style.getPropertyValue('--foreground')).toBe('#ffffff');
    expect(graphic.querySelectorAll('pattern')).toHaveLength(2);
    for (const line of graphic.querySelectorAll('pattern line')) {
      expect(line).toHaveAttribute('stroke', 'var(--foreground)');
    }
    const fills = Array.from(graphic.querySelectorAll('.recharts-bar path'))
      .map(node => node.getAttribute('fill'));
    expect(new Set(fills).size).toBe(2);
  } finally { restore(); }
});
