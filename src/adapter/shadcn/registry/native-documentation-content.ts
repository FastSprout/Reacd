import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { navigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation/navigation.schema.js';
import { pageLinksSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-links/page-links.schema.js';
import { pageAnchorsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-anchors/page-anchors.schema.js';
import { codeBlockSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/code-block/code-block.schema.js';
import { ShadcnNavigation } from '../navigation/navigation.adapter.js';
import { ShadcnPageLinks } from '../page-links/page-links.adapter.js';
import { ShadcnPageAnchors } from '../page-anchors/page-anchors.adapter.js';
import { ShadcnCodeBlock } from '../code-block/code-block.adapter.js';

export const nativeDocumentationContentEntries = {
  Navigation: renderEntry('Navigation', navigationSchema, ShadcnNavigation),
  PageLinks: renderEntry('PageLinks', pageLinksSchema, ShadcnPageLinks),
  PageAnchors: renderEntry('PageAnchors', pageAnchorsSchema, ShadcnPageAnchors),
  CodeBlock: renderEntry('CodeBlock', codeBlockSchema, ShadcnCodeBlock),
};
