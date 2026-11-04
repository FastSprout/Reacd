import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Image } from './index.js';
import { ReacdProvider } from '../../state/provider/provider.js';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { defineThemeAdapter } from '../../renderer/contracts/validate-adapter.js';

it('renders a simple image using the default adapter', () => {
  render(
    <ReacdProvider>
      <Image src="/photo.jpg" alt="Product photo" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Product photo' }))
    .toHaveAttribute('src', '/photo.jpg');
});

it('throws when the explicitly selected adapter has no Image mapping', () => {
  const adapter = defineThemeAdapter({
    id: 'missing-image', Surface: shadcnAdapter.Surface, components: {},
  });
  expect(() => render(
    <ReacdProvider adapter={adapter}>
      <Image src="/photo.jpg" alt="Product photo" />
    </ReacdProvider>,
  )).toThrow('does not support component "Image"');
});
