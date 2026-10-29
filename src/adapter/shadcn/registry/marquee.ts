import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { marqueeSchema } from '../../../schema/marquee/index.js';
import { ShadcnMarquee } from '../marquee/marquee.adapter.js';
export const marqueeEntries = {
  Marquee: renderEntry('Marquee', marqueeSchema, ShadcnMarquee),
};
