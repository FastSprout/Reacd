import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EditorialImage } from '../editorial/editorial-image.js';

describe('shared media rendering', () => {
  it('preserves editorial dimensions and retries changed sources', () => {
    const view = render(<EditorialImage src="/editorial.png" alt="Example image" />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '640');
    expect(image).toHaveAttribute('height', '360');
    fireEvent.error(image);
    expect(screen.getByRole('img')).toHaveTextContent('Image unavailable:');
    view.rerender(<EditorialImage src="/replacement.png" alt="Example image" />);
    expect(screen.getByRole('img').tagName).toBe('IMG');
    expect(
      renderToString(<EditorialImage src="/ssr.png" alt="SSR example" />),
    ).toContain('width="640"');
  });
});
