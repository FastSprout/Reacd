import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { inputTagsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-tags/index.js';
import { ShadcnInputTags } from '../input-tags/input-tags.adapter.js';

export const nativeInputTagsEntries = {
  InputTags: renderEntry('InputTags', inputTagsSchema, ShadcnInputTags),
};
