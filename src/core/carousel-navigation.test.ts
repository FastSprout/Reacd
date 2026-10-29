import { expect, it } from 'vitest';
import { carouselTarget } from './carousel-navigation.js';
it('navigates bounded, looping, RTL and vertical controlled indexes', () => {
  expect(carouselTarget(0, 3, 'ArrowRight', 'horizontal', 'ltr', false)).toBe(1);
  expect(carouselTarget(0, 3, 'ArrowLeft', 'horizontal', 'ltr', false)).toBe(0);
  expect(carouselTarget(0, 3, 'ArrowLeft', 'horizontal', 'ltr', true)).toBe(2);
  expect(carouselTarget(2, 3, 'ArrowRight', 'horizontal', 'ltr', true)).toBe(0);
  expect(carouselTarget(0, 3, 'ArrowLeft', 'horizontal', 'rtl', false)).toBe(1);
  expect(carouselTarget(1, 3, 'ArrowRight', 'horizontal', 'rtl', false)).toBe(0);
  expect(carouselTarget(1, 3, 'ArrowDown', 'vertical', 'rtl', false)).toBe(2);
  expect(carouselTarget(1, 3, 'ArrowUp', 'vertical', 'ltr', false)).toBe(0);
  expect(carouselTarget(1, 3, 'Home', 'horizontal', 'ltr', false)).toBe(0);
  expect(carouselTarget(1, 3, 'End', 'horizontal', 'ltr', false)).toBe(2);
  expect(carouselTarget(1, 3, 'Tab', 'horizontal', 'ltr', false)).toBeUndefined();
  expect(
    carouselTarget(0, 0, 'ArrowRight', 'horizontal', 'ltr', false),
  ).toBeUndefined();
});
