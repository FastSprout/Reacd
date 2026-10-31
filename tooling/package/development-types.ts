import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { isReleaseVersion } from '../release/policy.js';

const metadataSchema = z.object({ version: z.string().refine(isReleaseVersion) });

export function installedTypeDependencies(root: string) {
  function version(name: string): string {
    const input: unknown = JSON.parse(
      readFileSync(join(root, 'node_modules/@types', name, 'package.json'), 'utf8'),
    );
    return metadataSchema.parse(input).version;
  }
  return {
    '@types/node': version('node'),
    '@types/react': version('react'),
    '@types/react-dom': version('react-dom'),
  };
}
