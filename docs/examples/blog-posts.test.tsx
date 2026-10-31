import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { BlogPostsExample } from './blog-posts.js';

it('runs the BlogPosts reference example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BlogPostsExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
