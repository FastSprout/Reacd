import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { defineGenerativeDeclaration } from
  '../../schema/generative-v2/define-declaration.js';

it('renders the same safe logo DTOs from generative declarations', () => {
  const declaration = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [],
    root: {
      type: 'PageLogos',
      label: 'Generated image placeholders',
      items: [
        {
          key: 'example',
          src: '/placeholder.png',
          alt: 'Generated placeholder',
        },
      ],
    },
  });
  render(<GenerativeUI adapter={shadcnAdapter} document={declaration} />);
  expect(
    screen.getByRole('img', { name: 'Generated placeholder' }),
  ).toBeInTheDocument();
  expect(
    renderToString(<GenerativeUI adapter={shadcnAdapter} document={declaration} />),
  ).toContain('Generated placeholder');
});
