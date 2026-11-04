import { expect, it } from 'vitest';
import { imageSchema, imageNodeSchema } from './index.js';

const picture = { src: '/photo.jpg', alt: 'Product photo' };

it('accepts simple images and logical aspect choices', () => {
  expect(imageSchema.parse(picture)).toEqual(picture);
  for (const aspect of ['landscape', 'square', 'portrait']) {
    expect(imageSchema.safeParse({ ...picture, aspect }).success).toBe(true);
  }
  expect(imageSchema.safeParse({
    ...picture, src: 'https://example.com/photo.jpg',
  }).success).toBe(true);
  expect(imageNodeSchema.parse({ ...picture, type: 'Image' })).toEqual({
    ...picture, type: 'Image',
  });
});

it('rejects missing properties, unsafe sources and styling escapes', () => {
  expect(imageSchema.safeParse({ alt: picture.alt }).success).toBe(false);
  expect(imageSchema.safeParse({ src: picture.src }).success).toBe(false);
  for (const changes of [
    { src: '' }, { alt: '' }, { src: 'javascript:alert(1)' },
    { src: 'data:image/svg+xml,markup' }, { src: '//example.com/photo.jpg' },
    { src: 'https://user:password@example.com/photo.jpg' },
    { aspect: 'wide' }, { mode: 'light' }, { className: 'custom' },
    { style: {} }, { children: 'Custom content' }, { onLoad: () => undefined },
  ]) {
    expect(imageSchema.safeParse({ ...picture, ...changes }).success).toBe(false);
  }
});
