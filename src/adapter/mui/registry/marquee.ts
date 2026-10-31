import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { marqueeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/marquee/index.js';
import { MuiMarquee } from '../marquee/marquee.adapter.js';
export const marqueeEntries = {
  Marquee: renderEntry('Marquee', marqueeSchema, MuiMarquee),
};
