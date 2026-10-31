import { appendFileSync } from 'node:fs';
import { readReleaseSnapshot } from '../tooling/release/complete.js';
import { createReleaseGitHub } from '../tooling/release/github-client.js';
import { parseReleaseIdentity } from '../tooling/release/verify-environment.js';

const output = process.env['GITHUB_OUTPUT'];
if (!output) throw new Error('Draft details require a job output destination.');
const identity = parseReleaseIdentity(process.env);
const snapshot = readReleaseSnapshot(identity, createReleaseGitHub());
appendFileSync(output, `details=${JSON.stringify(snapshot)}\n`);
console.log(`Checked draft details prepared: ${identity.tag}.`);
