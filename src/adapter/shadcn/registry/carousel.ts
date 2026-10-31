import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { carouselSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/carousel/index.js';
import { ShadcnCarousel } from '../carousel/carousel.adapter.js';
export const carouselEntries = {
  Carousel: renderEntry('Carousel', carouselSchema, ShadcnCarousel),
};
