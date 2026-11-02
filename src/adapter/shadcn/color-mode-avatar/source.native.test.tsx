import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ShadcnColorModeAvatar } from './color-mode-avatar.adapter.js';

afterEach(() => vi.unstubAllGlobals());

it('passes each controlled source to the SDK image loading lifecycle', async () => {
  const probes: HTMLImageElement[] = [];
  const NativeImage = window.Image;
  class ImageProbe extends NativeImage {
    constructor() {
      super();
      probes.push(this);
    }
  }
  vi.stubGlobal('Image', ImageProbe);
  const view = render(
    <ShadcnColorModeAvatar
      mode="light"
      name="Ada"
      light="/light.png"
      dark="/dark.png"
    />,
  );
  const light = probes.find((image) => image.getAttribute('src') === '/light.png');
  if (!light) throw new Error('SDK did not preload the light image.');
  Object.defineProperties(light, {
    complete: { value: true },
    naturalWidth: { value: 32 },
  });
  fireEvent.load(light);
  await waitFor(() =>
    expect(view.container.querySelector('[data-slot=avatar-image]')).toHaveAttribute(
      'src',
      '/light.png',
    ),
  );
  view.rerender(
    <ShadcnColorModeAvatar
      mode="dark"
      name="Ada"
      light="/light.png"
      dark="/dark.png"
    />,
  );
  const dark = probes.find((image) => image.getAttribute('src') === '/dark.png');
  if (!dark) throw new Error('SDK did not preload the dark image.');
  Object.defineProperties(dark, {
    complete: { value: true },
    naturalWidth: { value: 32 },
  });
  fireEvent.load(dark);
  await waitFor(() =>
    expect(view.container.querySelector('[data-slot=avatar-image]')).toHaveAttribute(
      'src',
      '/dark.png',
    ),
  );
  expect(screen.getByRole('img', { name: 'Ada' })).toBeVisible();
});
