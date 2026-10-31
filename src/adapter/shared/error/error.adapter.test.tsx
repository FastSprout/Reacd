import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SharedError } from './error.adapter.js';

describe('recoverable error presentation', () => {
  it('renders a named region without leaking exceptions', () => {
    render(<SharedError statusCode={500} title="Service unavailable" />);
    expect(
      screen.getByRole('region', { name: 'Service unavailable' }),
    ).not.toHaveAttribute('aria-describedby');
    expect(screen.getByText('500')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('preserves recovery content and a named safe link in SSR', () => {
    const view = (
      <SharedError
        statusCode={404}
        title="Not found"
        message="The requested page is unavailable."
        leading="Leading"
        actions="Actions"
        redirect="/"
        recoveryLabel="Go home"
      >
        Details
      </SharedError>
    );
    render(view);
    expect(screen.getByRole('region', { name: 'Not found' })).toHaveAttribute(
      'aria-describedby',
    );
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
    for (const text of ['Leading', 'Actions', 'Details']) {
      expect(screen.getByText(text)).toBeVisible();
    }
    expect(renderToStaticMarkup(view)).toContain('The requested page is unavailable.');
  });
});
