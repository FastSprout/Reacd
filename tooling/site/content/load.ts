import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pageRoute, readSiteConfig } from '../config/config.js';
import { includeSnippets, markdownFiles, publicFile } from './files.js';
import { readFrontmatter } from './frontmatter.js';
import { parseMarkdown } from './markdown.js';
import { resolveBlocks } from './links.js';
import { siteManifestSchema } from './model.schema.js';
import type { SiteManifest, SiteNavigation, SitePage } from './model.js';

function validateNavigation(
  entries: readonly SiteNavigation[],
  pages: readonly SitePage[],
  keys = new Set<string>(),
) {
  for (const entry of entries) {
    if (keys.has(entry.key)) throw new Error(`Duplicate navigation key: ${entry.key}`);
    keys.add(entry.key);
    if (entry.href && !pages.some((page) => page.route === entry.href)) {
      throw new Error(`Navigation points to an unknown page: ${entry.href}`);
    }
    if (entry.children) validateNavigation(entry.children, pages, keys);
  }
}

export async function loadSite(root: string): Promise<SiteManifest> {
  const configuration = readSiteConfig(
    await readFile(resolve(root, 'site.config.yml'), 'utf8'),
  );
  const docs = resolve(root, 'docs');
  const files = await markdownFiles(docs);
  const pages: SitePage[] = [];
  for (const sourcePath of files) {
    const source = (await readFile(await publicFile(docs, sourcePath), 'utf8')).replace(
      /\r\n/g,
      '\n',
    );
    const metadata = readFrontmatter(source);
    const expanded = await includeSnippets(docs, metadata.content);
    const parsed = await parseMarkdown(expanded, metadata.preview);
    const route = pageRoute(sourcePath);
    if (pages.some((page) => page.route === route)) {
      throw new Error(`Duplicate documentation route: ${route}`);
    }
    pages.push({
      route,
      sourcePath,
      title: metadata.title ?? parsed.title ?? sourcePath.replace(/\.md$/, ''),
      titleAnchor: parsed.titleAnchor,
      description: metadata.description ?? configuration.description,
      headings: parsed.headings,
      sections: parsed.sections,
      source,
    });
  }
  validateNavigation(configuration.navigation, pages);
  const resolvedPages = await Promise.all(
    pages.map(async (page): Promise<SitePage> => ({
      ...page,
      sections: await Promise.all(
        page.sections.map(async (section) =>
          section.type === 'prose'
            ? {
                ...section,
                document: await resolveBlocks(
                  docs,
                  page,
                  pages,
                  section.document,
                  configuration.origin,
                ),
              }
            : section,
        ),
      ),
    })),
  );
  return siteManifestSchema.parse({ ...configuration, pages: resolvedPages });
}
