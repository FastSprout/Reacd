import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { carouselSchema } from '../../src/schema/carousel/carousel.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { CarouselExample } from './carousel.js';

it('reports native unavailability and preserves host-controlled slide changes', () => {
  expectUnsupportedExample(<CarouselExample />, 'Carousel');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <CarouselExample />
    </probe.Surface>,
  );
  const read = () => probe.read('Carousel', carouselSchema, 'Getting started');
  expect(read().items.map((item) => item.id)).toEqual(['team', 'work', 'progress']);
  expect(read().value).toBe(0);
  for (const value of [1, 2, 1]) {
    act(() => read().onValueChange(value));
    expect(read().value).toBe(value);
  }
  expect(probe.texts()).toEqual(
    expect.arrayContaining([
      'Invite your team',
      'Organize your work',
      'Track progress',
    ]),
  );
});
