import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { carouselSchema } from '../../../schema/carousel/index.js';
import { ShadcnCarousel } from '../carousel/carousel.adapter.js';
export const carouselEntries = {
  Carousel: renderEntry('Carousel', carouselSchema, ShadcnCarousel),
};
