import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { BlogPostsExample } from './blog-posts.js';

it('runs the BlogPosts reference example', () => {
  render(
    <ReacdProvider>
      <BlogPostsExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
