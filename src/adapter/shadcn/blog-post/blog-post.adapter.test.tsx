import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  BlogPost,
  BlogPosts,
  Button,
  ChangelogVersion,
  ChangelogVersions,
  ReacdProvider,
  Text,
} from '../../../index.js';
import { EDITORIAL_VARIANTS } from '../../../core/editorial-policy.js';

describe('editorial article and collection adapters', () => {
  it('keeps actions independent and dates explicit', async () => {
    const user = userEvent.setup();
    const inspect = vi.fn();
    const edit = vi.fn();
    render(
      <ReacdProvider>
        <BlogPost
          title="Inspect example"
          onPress={inspect}
          description="Illustrative entry"
          date="2024-02-29"
          dateLabel="Leap day"
          header="Article header"
          badge={<Text>Example category</Text>}
          authors={<Text>Author slot placeholder</Text>}
          footer="Article footer"
          actions={<Button label="Edit entry" onPress={edit} />}
        >
          Article body
        </BlogPost>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Inspect example' }));
    await user.click(screen.getByRole('button', { name: 'Edit entry' }));
    expect(inspect).toHaveBeenCalledOnce();
    expect(edit).toHaveBeenCalledOnce();
    expect(screen.getByText('Leap day')).toHaveAttribute('datetime', '2024-02-29');
    expect(screen.getByRole('article')).toHaveTextContent('Article header');
    expect(screen.getByRole('article')).toHaveTextContent('Article footer');
  });

  it('reserves media space and resets source failure', () => {
    const view = render(
      <ReacdProvider>
        <BlogPost
          title="Media entry"
          image={{
            src: '/first.png',
            alt: 'Illustrative image placeholder',
          }}
        />
      </ReacdProvider>,
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '640');
    expect(image).toHaveAttribute('height', '360');
    fireEvent.error(image);
    expect(screen.getByRole('img')).toHaveTextContent('Image unavailable');
    view.rerender(
      <ReacdProvider>
        <BlogPost
          title="Media entry"
          image={{
            src: '/second.png',
            alt: 'Replacement image placeholder',
          }}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', '/second.png');
  });

  it('composes keyed entries and safe children in source order', () => {
    render(
      <ReacdProvider>
        <BlogPosts
          posts={[
            {
              key: 'first',
              title: 'First entry',
              href: '/',
              newWindow: true,
              date: '2026-10-29',
              orientation: 'horizontal',
            },
          ]}
        >
          {false}
          <BlogPost title="Child entry" />
          {'Plain supplemental child'}
        </BlogPosts>
        <BlogPosts orientation="vertical" />
        <ChangelogVersions
          indicator={false}
          versions={[
            { key: 'hidden', title: 'No indicator' },
            { key: 'shown', title: 'Explicit indicator', indicator: true },
          ]}
        >
          <ChangelogVersion title="Inherited indicator" />
        </ChangelogVersions>
        <ChangelogVersions />
        <ChangelogVersion />
        {EDITORIAL_VARIANTS.map((variant) => (
          <BlogPost key={variant} title={variant} variant={variant} />
        ))}
      </ReacdProvider>,
    );
    expect(screen.getByRole('link', { name: 'First entry' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    for (const name of ['No indicator', 'Inherited indicator']) {
      expect(screen.getByRole('article', { name })).toHaveAttribute(
        'data-indicator',
        'false',
      );
    }
    expect(screen.getByRole('article', { name: 'Explicit indicator' })).toHaveAttribute(
      'data-indicator',
      'true',
    );
    expect(screen.getByText('2026-10-29')).toHaveAttribute('datetime', '2026-10-29');
    expect(
      renderToString(
        <ReacdProvider>
          <BlogPost title="Server entry" />
        </ReacdProvider>,
      ),
    ).toContain('Server entry');
  });
});
