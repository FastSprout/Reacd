import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSpacer } from './spacer.adapter.js';

it('uses SDK layout flexibility without exposing decorative content', () => {
  const view = render(<ShadcnSpacer />);
  expect(view.container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  expect(view.container.firstElementChild?.className).toContain('flex-1');
});
