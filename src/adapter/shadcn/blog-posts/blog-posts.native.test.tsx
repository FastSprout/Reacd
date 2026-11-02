import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnBlogPosts } from './blog-posts.adapter.js';
it('preserves keyed article order and state across native collection reflow', () => {
  const posts = [
    {
      key: 'one',
      title: 'First',
      children: <input aria-label="Draft" defaultValue="Saved" />,
    },
    { key: 'two', title: 'Second' },
  ];
  const view = render(<ShadcnBlogPosts posts={posts}>Additional</ShadcnBlogPosts>);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  const field = screen.getByRole('textbox');
  view.rerender(
    <ShadcnBlogPosts posts={[...posts].reverse()} orientation="vertical">
      Additional
    </ShadcnBlogPosts>,
  );
  expect(screen.getAllByRole('article')[0]).toHaveAttribute('aria-label', 'Second');
  expect(screen.getByRole('textbox')).toBe(field);
  expect(field).toHaveValue('Saved');
  view.rerender(<ShadcnBlogPosts />);
  expect(screen.queryByRole('listitem')).toBeNull();
});
