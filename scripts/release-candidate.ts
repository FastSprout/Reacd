import { prepareReleaseCandidate } from '../tooling/release/candidate.js';
import { verifyCandidateSnapshot } from '../tooling/release/complete.js';
import { RELEASE_SOURCE_POLICY } from '../tooling/release/github-client.js';
import { parseReleaseIdentity } from '../tooling/release/verify-environment.js';

const root = new URL('../', import.meta.url);
const identity = parseReleaseIdentity(process.env);
const source =
  process.env['RELEASE_RECOVERY'] === 'true'
    ? new URL(RELEASE_SOURCE_POLICY.recoveryDirectory, root)
    : root;
const packages = prepareReleaseCandidate(root, source, identity);
const details = process.env['RELEASE_DETAILS'];
if (!details) throw new Error('Release candidate requires checked draft details.');
const snapshot: unknown = JSON.parse(details);
const release = verifyCandidateSnapshot(identity, packages, snapshot);
if (!release.draft) throw new Error('Release candidate must remain a private draft.');
console.log(`Release candidate archives verified: ${identity.tag}.`);
