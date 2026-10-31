import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { BlogPostExample } from './blog-post.js';

it('runs the BlogPost reference example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BlogPostExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
