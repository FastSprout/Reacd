import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnFooter } from './footer.adapter.js';

it('preserves all SDK footer content slots in reading order', () => {
  render(
    <ShadcnFooter top="Top" start="Start" end="End" bottom="Bottom">
      Center
    </ShadcnFooter>,
  );
  expect(screen.getByRole('contentinfo')).toHaveTextContent('TopStartCenterEndBottom');
});
