import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parsePublicationManifest } from '../tooling/release/metadata.js';
import { parseReleaseEnvironment } from '../tooling/release/verify-environment.js';
import { verifyPublicationRuntime } from '../tooling/release/verify-runtime.js';
import { verifyReleaseCheckout } from '../tooling/release/verify.js';

const root = new URL('../', import.meta.url);
const input: unknown = JSON.parse(
  readFileSync(new URL('package.json', root), 'utf8'),
);
const manifest = parsePublicationManifest(input);
const identity = parseReleaseEnvironment(process.env);
if (identity.version !== manifest.version) {
  throw new Error('Release verification rejected the package version.');
}
verifyPublicationRuntime();
verifyReleaseCheckout(fileURLToPath(root), identity);
console.log(
  `Release identity verified: ${manifest.name}@${manifest.version} ` +
    `(${identity.tag}).`,
  'OIDC prerequisites present; npm authorization is not verified.',
);
