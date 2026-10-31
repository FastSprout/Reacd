import { pageLogosSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-logos/page-logos.schema.js';
import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { ShadcnPageLogos } from '../page-logos/page-logos.adapter.js';

export const pageLogosEntries = {
  PageLogos: renderEntry('PageLogos', pageLogosSchema, ShadcnPageLogos),
};
