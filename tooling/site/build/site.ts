import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { resolve, join, extname, posix } from 'node:path';
import { loadSite } from '../content/index.js';
import { renderSiteDocument } from '../runtime/server.js';
import { SITE_POLICY } from '../policy.js';
import { sitePayloadSchema } from '../content/model.schema.js';
import { publicFile } from '../content/files.js';
import type { SiteManifest } from '../content/model.js';
import type { ProseBlock, ProseInline } from '../../../src/core/prose.js';
import { assertLazyMaterialRuntime } from './manifest.js';

function referencedAssets(manifest: SiteManifest): Set<string> {
  const assets = new Set<string>();
  const pending: (ProseBlock | ProseInline)[] = manifest.pages.flatMap((page) =>
    page.sections.flatMap((section) =>
      section.type === 'prose' ? [...section.document] : [],
    ),
  );
  for (const node of pending) {
    const href =
      node.type === 'image' ? node.src : node.type === 'link' ? node.href : '';
    if (href.startsWith('/')) {
      const target = posix
        .normalize(decodeURIComponent(new URL(href, manifest.origin).pathname))
        .slice(1);
      if (extname(target)) {
        if (/\.(?:test|spec)\.|(?:^|\/)tsconfig\.json$/.test(target)) {
          throw new Error(`Private documentation asset cannot be published: ${target}`);
        }
        assets.add(target);
      }
    }
    if ('children' in node) pending.push(...node.children);
    if (node.type === 'list') {
      for (const item of node.items) pending.push(...item.children);
    }
    if (node.type === 'table') {
      pending.push(...node.header.flat(), ...node.rows.flat(2));
    }
  }
  return assets;
}

async function publicFiles(root: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(join(root, prefix), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...(await publicFiles(root, path)));
    else files.push(path);
  }
  return files;
}

async function validateAssetDestinations(
  root: string,
  manifest: SiteManifest,
  assets: ReadonlySet<string>,
): Promise<void> {
  const identity = (path: string) => path.normalize('NFC').toLowerCase();
  const generated = manifest.pages.flatMap((page) =>
    [
      SITE_POLICY.pageDocumentName,
      SITE_POLICY.pageDataName,
      SITE_POLICY.pageSourceName,
    ].map((file) => posix.join(page.route.slice(1), file)),
  );
  const occupied = new Set(
    [
      ...generated,
      ...SITE_POLICY.generatedRootFiles,
      SITE_POLICY.runtimeModulesName,
      SITE_POLICY.runtimeManifestPath,
      ...(await publicFiles(resolve(root, 'tooling/site/public'))),
    ].map(identity),
  );
  for (const asset of assets) {
    const target = identity(asset);
    if (
      target.startsWith(`${SITE_POLICY.runtimeAssetsDirectory}/`) ||
      target.startsWith(`${posix.dirname(SITE_POLICY.runtimeManifestPath)}/`) ||
      occupied.has(target)
    ) {
      throw new Error(`Reserved documentation output cannot be replaced: ${asset}`);
    }
  }
}

async function promote(root: string, staging: string): Promise<void> {
  const destination = resolve(root, SITE_POLICY.outputDirectory);
  const previous = resolve(root, SITE_POLICY.previousDirectory);
  let preserved = false;
  try {
    await rename(destination, previous);
    preserved = true;
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
      throw error;
    }
  }
  try {
    await rename(staging, destination);
  } catch (error) {
    if (preserved) await rename(previous, destination);
    throw error;
  }
  if (preserved) await rm(previous, { recursive: true, force: true });
}

export async function buildSite(root: string): Promise<void> {
  const runtime = resolve(root, SITE_POLICY.runtimeDirectory);
  const [bundleSource, modulesSource] = await Promise.all([
    readFile(join(runtime, SITE_POLICY.runtimeManifestPath), 'utf8'),
    readFile(join(runtime, SITE_POLICY.runtimeModulesName), 'utf8'),
  ]);
  const bundle: unknown = JSON.parse(bundleSource);
  const modules: unknown = JSON.parse(modulesSource);
  assertLazyMaterialRuntime(bundle, modules);
  const appearanceScript = await readFile(
    join(runtime, SITE_POLICY.runtimeAppearance), 'utf8',
  );
  const manifest = await loadSite(root);
  const assets = referencedAssets(manifest);
  await validateAssetDestinations(root, manifest, assets);
  const output = resolve(root, SITE_POLICY.stagingDirectory);
  const index = manifest.pages.map(({ route, title, description }) => ({
    route,
    title,
    description,
  }));
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  try {
    for (const page of manifest.pages) {
      const directory = join(output, page.route.replace(/^\//, ''));
      const payload = sitePayloadSchema.parse({
        page,
        navigation: manifest.navigation,
        index,
        origin: manifest.origin,
        title: manifest.title,
        description: manifest.description,
      });
      await mkdir(directory, { recursive: true });
      await writeFile(
        join(directory, SITE_POLICY.pageDocumentName),
        renderSiteDocument(payload, appearanceScript),
      );
      await writeFile(
        join(directory, SITE_POLICY.pageDataName),
        JSON.stringify(payload),
      );
      await writeFile(join(directory, SITE_POLICY.pageSourceName), page.source);
    }
    await cp(
      resolve(root, SITE_POLICY.runtimeDirectory, SITE_POLICY.runtimeAssetsDirectory),
      join(output, SITE_POLICY.runtimeAssetsDirectory),
      { recursive: true },
    );
    await cp(resolve(root, 'tooling/site/public'), output, { recursive: true });
    for (const target of assets) {
      const source = await publicFile(resolve(root, 'docs'), target);
      const destination = join(output, target);
      await mkdir(resolve(destination, '..'), { recursive: true });
      await cp(source, destination);
    }
    await writeFile(join(output, '.nojekyll'), '');
    await writeFile(join(output, 'CNAME'), new URL(manifest.origin).hostname + '\n');
    const urls = manifest.pages
      .map(
        (page) => `<url><loc>${new URL(page.route, manifest.origin).href}</loc></url>`,
      )
      .join('');
    await writeFile(
      join(output, 'sitemap.xml'),
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        urls +
        '</urlset>',
    );
    const sitemap = new URL('sitemap.xml', manifest.origin).href;
    await writeFile(
      join(output, 'robots.txt'),
      `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`,
    );
    await promote(root, output);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
}
