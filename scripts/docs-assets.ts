import { join } from 'node:path';
import { COMPONENT_NAMES } from '../src/components/component-names.js';
import { previewRegistry } from '../tooling/docs-preview/registry.js';
import {
  publishPreviewAssets,
  validateReferences,
} from '../tooling/docs-preview/artifacts.js';

const root = process.cwd();
const entries = COMPONENT_NAMES.map((name) => ({
  name,
  source: previewRegistry[name].source,
}));
const sourceOnly = process.argv.includes('--source');
validateReferences(root, entries, !sourceOnly);
if (!sourceOnly) {
  publishPreviewAssets(join(root, '.cache/docs-preview-dist'), join(root, 'site'));
}
