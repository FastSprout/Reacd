import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { VStackExample } from './v-stack.js';

it('runs the VStack public example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <VStackExample />
    </ReacdProvider>,
  );
  for (const text of ['Prepare the record', 'Review the record', 'Publish the record'])
    expect(screen.getByText(text)).toBeVisible();
});
