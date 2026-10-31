import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageLogos, ReacdProvider } from '../../../index.js';

describe('PageLogos adapter', () => {
  it('exposes empty content and named static images', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PageLogos label="Example marks" items={[]} />
      </ReacdProvider>,
    );
    expect(screen.getByText('No logos to display.')).toBeVisible();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <PageLogos
          label="Example marks"
          title="Host supplied marks"
          emptyLabel="No host images"
          items={[]}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Host supplied marks');
    expect(screen.getByText('No host images')).toBeVisible();
  });

  it('retains image identity across order changes and recovers new sources', () => {
    const first = { key: 'first', src: '/first.png', alt: 'First placeholder' };
    const second = { key: 'second', src: '/second.png', alt: 'Second placeholder' };
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PageLogos label="Example marks" items={[first, second]} />
      </ReacdProvider>,
    );
    const image = screen.getByRole('img', { name: 'First placeholder' });
    expect(image).toHaveAttribute('width', '160');
    expect(image).toHaveAttribute('height', '80');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <PageLogos label="Example marks" items={[second, first]} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'First placeholder' })).toBe(image);
    fireEvent.error(image);
    expect(screen.getByRole('img', { name: 'First placeholder' })).toHaveTextContent(
      'Image unavailable:',
    );
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <PageLogos
          label="Example marks"
          items={[{ ...first, src: '/replacement.png' }]}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'First placeholder' }).tagName).toBe('IMG');
  });
});
