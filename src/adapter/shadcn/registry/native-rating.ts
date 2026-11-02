import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { inputRatingSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-rating/input-rating.schema.js';
import { ShadcnInputRating } from '../input-rating/input-rating.adapter.js';

export const nativeRatingEntries = {
  InputRating: renderEntry('InputRating', inputRatingSchema, ShadcnInputRating),
};
