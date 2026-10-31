import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CodeBlockExample } from './code-block.js';

it('runs the CodeBlock public example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <CodeBlockExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('const ready = true;')).toBeVisible();
});
