import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export async function publicFile(root: string, file: string): Promise<string> {
  const base = await realpath(root);
  const target = await realpath(resolve(base, file));
  const local = relative(base, target);
  if (!local || isAbsolute(local) || local === '..' || local.startsWith(`..${sep}`)) {
    throw new Error(`Documentation path escapes public source: ${file}`);
  }
  if (!(await stat(target)).isFile()) {
    throw new Error(`Documentation source must be a file: ${file}`);
  }
  return target;
}

export async function markdownFiles(root: string, path = ''): Promise<string[]> {
  const entries = await readdir(resolve(root, path), { withFileTypes: true });
  const result: string[] = [];
  for (const entry of entries) {
    const local = path ? `${path}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not documentation sources: ${local}`);
    }
    if (entry.isDirectory()) result.push(...(await markdownFiles(root, local)));
    else if (entry.name.endsWith('.md')) result.push(local);
  }
  return result.sort();
}

export async function includeSnippets(
  root: string,
  source: string,
  ancestors: readonly string[] = [],
): Promise<string> {
  const pattern = /^([ \t]*)--8<-- "([^"\n]+)"[ \t]*$/gm;
  let result = '';
  let end = 0;
  for (const match of source.matchAll(pattern)) {
    const indent = match[0].slice(0, match[0].indexOf('--8<--'));
    const requested = match[0].trim().slice(8, -1);
    if (
      !/^[\w/.-]+\.(?:tsx?|md)$/.test(requested) ||
      isAbsolute(requested) ||
      requested.split('/').includes('..') ||
      /\.(?:test|spec)\./.test(requested)
    ) {
      throw new Error(`Invalid public snippet: ${requested}`);
    }
    const target = await publicFile(root, requested);
    if (ancestors.includes(target)) {
      throw new Error(`Cyclic documentation snippet: ${requested}`);
    }
    const included = await includeSnippets(root, await readFile(target, 'utf8'), [
      ...ancestors,
      target,
    ]);
    result +=
      source.slice(end, match.index) +
      included
        .trimEnd()
        .split('\n')
        .map((line) => `${indent}${line}`)
        .join('\n');
    end = match.index + match[0].length;
  }
  return result + source.slice(end);
}
