import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { KbdExample } from './kbd.js';

it('names the Escape key', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <KbdExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Escape' })).toBeVisible();
});
