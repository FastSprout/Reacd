import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContentSurround, ReacdProvider } from '../../../index.js';

describe('adjacent document navigation', () => {
  it('exposes labeled native links and only real destinations', () => {
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <ContentSurround
          label="Adjacent reference"
          previous={{ title: 'Earlier document', href: '/' }}
          next={{
            title: 'Later document',
            href: '/',
            description: 'Next topic',
            newWindow: true,
          }}
        />
      </ReacdProvider>,
    );
    expect(
      screen.getByRole('navigation', { name: 'Adjacent reference' }),
    ).toBeVisible();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: 'Previous Earlier document' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Next Later document' })).toBeVisible();
    expect(links[1]).toHaveAttribute('rel', 'noopener noreferrer');
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <ContentSurround next={{ title: 'Only next', href: '/' }} />
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <ContentSurround previous={{ title: 'Only previous', href: '/' }} />
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('renders explicit empty content and stable server markup', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <ContentSurround />
      </ReacdProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Adjacent pages' })).toBeVisible();
    expect(screen.getByText('No adjacent pages.')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      renderToString(
        <ReacdProvider adapter={activeTestAdapter}>
          <ContentSurround emptyLabel="No nearby document." />
        </ReacdProvider>,
      ),
    ).toContain('No nearby document.');
  });
});
