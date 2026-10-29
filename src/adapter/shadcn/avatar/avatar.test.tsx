import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, ReacdProvider } from '../../../index.js';

describe('shadcn Avatar', () => {
  it('preserves identity through image load, error, and source changes', async () => {
    const view = render(
      <ReacdProvider>
        <Avatar name="Example Reader" src="/first.png" />
      </ReacdProvider>,
    );
    const image = view.container.querySelector('img');
    if (image === null) throw new Error('Expected mounted image.');
    expect(screen.getByRole('img', { name: 'Example Reader' })).toHaveTextContent('ER');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('width', '48');
    fireEvent.load(image);
    await waitFor(() => expect(screen.queryByText('ER')).toBeNull());
    expect(screen.getAllByRole('img')).toHaveLength(1);
    fireEvent.error(image);
    await waitFor(() => expect(screen.getByText('ER')).toBeInTheDocument());
    view.rerender(
      <ReacdProvider>
        <Avatar name="Example Editor" src="/second.png" />
      </ReacdProvider>,
    );
    expect(image).toHaveAttribute('src', '/second.png');
    expect(screen.getByRole('img', { name: 'Example Editor' })).toHaveTextContent('EE');
    fireEvent.load(image);
    await waitFor(() => expect(screen.queryByText('EE')).toBeNull());
  });
  it('supports absent sources, custom graphemes, and all logical sizes', () => {
    render(
      <ReacdProvider>
        <Avatar name="Small" size="small" fallback="👩‍💻" />
        <Avatar name="Large" size="large" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Small' })).toHaveTextContent('👩‍💻');
    expect(screen.getByRole('img', { name: 'Large' })).toHaveTextContent('LA');
  });
});
