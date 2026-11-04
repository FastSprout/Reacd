import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { generativeDocumentSchema } from
  '../../schema/generative-v2/document.schema.js';

it('validates and renders Image as an optional generative leaf', () => {
  const document = {
    schemaVersion: '0.2', state: [],
    root: { type: 'Image', src: '/photo.jpg', alt: 'Product photo' },
  };
  expect(generativeDocumentSchema.safeParse(document).success).toBe(true);
  render(<GenerativeUI document={document} />);
  expect(screen.getByRole('img', { name: 'Product photo' }))
    .toHaveAttribute('src', '/photo.jpg');
});
