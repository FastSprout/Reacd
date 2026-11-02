import { render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { ShadcnChart } from './chart.adapter.js';

it.each(['line', 'area'] as const)(
  'keeps two native %s segments around missing observations', async (kind) => {
    const restore = installLayout(640);
    try {
      render(<ShadcnChart label="Changes" description="Signed observations"
        kind={kind}
        categories={['a', 'b', 'c', 'd', 'e'].map(id => ({ id, label: id }))}
        series={[{ id: 'change', label: 'Change', values: [-2, 3, null, 4, 5] },
          { id: 'other', label: 'Other', values: [1, 2, null, -3, -4] }]} />);
      const graphic = screen.getByRole('img');
      await waitFor(() => {
        const curve = graphic.querySelector(`.recharts-${kind}-curve`);
        expect(curve?.getAttribute('d')?.match(/M/g)).toHaveLength(2);
      });
      expect(graphic.querySelectorAll('pattern')).toHaveLength(2);
      const strokes = Array.from(graphic.querySelectorAll(`.recharts-${kind}-curve`))
        .map(node => node.getAttribute('stroke-dasharray'));
      expect(new Set(strokes).size).toBe(2);
      expect(screen.getByRole('table')).toHaveTextContent('-4');
    } finally { restore(); }
  },
);
