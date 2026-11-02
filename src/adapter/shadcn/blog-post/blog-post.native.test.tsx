import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { EDITORIAL_VARIANTS } from '../../../core/editorial-policy.js';
import { ShadcnBlogPost } from './blog-post.adapter.js';
it('retains editorial slots, literal dates and independent actions', async () => {
  const press = vi.fn();
  const child = vi.fn();
  const view = render(
    <ShadcnBlogPost
      title="Article"
      onPress={press}
      date="2026-11-02"
      dateLabel="Publication date"
      description="Overview"
      image={{ src: '/one.svg', alt: 'Editorial artwork' }}
      header="Header"
      badge="Category"
      authors="Author"
      footer="Footer"
      actions={<button onClick={child}>Independent action</button>}
    >
      Body
    </ShadcnBlogPost>,
  );
  expect(screen.getByRole('article', { name: 'Article' }).className).toContain(
    'rounded-xl',
  );
  expect(screen.getByText('Publication date')).toHaveAttribute(
    'datetime',
    '2026-11-02',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Article' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  await userEvent.click(screen.getByRole('button', { name: 'Independent action' }));
  expect(child).toHaveBeenCalledOnce();
  expect(press).toHaveBeenCalledTimes(1);
  const image = screen.getByRole('img', { name: 'Editorial artwork' });
  expect(image).toHaveAttribute('width', '640');
  fireEvent.error(image);
  expect(screen.getByRole('img')).toHaveTextContent('Image unavailable:');
  view.rerender(
    <ShadcnBlogPost
      date="2026-11-02"
      image={{ src: '/two.svg', alt: 'Replacement' }}
    />,
  );
  expect(screen.getByText('2026-11-02')).toHaveAttribute('datetime', '2026-11-02');
  expect(screen.getByRole('img')).toHaveAttribute('src', '/two.svg');
  for (const variant of EDITORIAL_VARIANTS) {
    view.rerender(
      <ShadcnBlogPost
        title="Linked"
        href="/guide/"
        newWindow
        variant={variant}
        orientation="horizontal"
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  }
  view.rerender(<ShadcnBlogPost />);
  expect(screen.queryByRole('heading')).toBeNull();
});
