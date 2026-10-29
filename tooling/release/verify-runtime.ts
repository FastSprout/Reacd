import { execFileSync } from 'node:child_process';
import { gte } from 'semver';
import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';

type ExecuteVersion = (
  executable: string,
  arguments_: string[],
  options: { encoding: 'utf8'; stdio: ['ignore', 'pipe', 'pipe'] },
) => string;

export function verifyPublicationRuntime(
  nodeVersion: string = process.versions.node,
  execute: ExecuteVersion = execFileSync,
): void {
  if (!isReleaseVersion(nodeVersion) ||
    !gte(nodeVersion, PUBLICATION_POLICY.minimumNodeVersion)) {
    throw new Error(
      `Release verification requires Node >=${PUBLICATION_POLICY.minimumNodeVersion}.`,
    );
  }
  let npmVersion: string;
  try {
    npmVersion = execute('npm', ['--version'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    throw new Error('Release verification npm prerequisite failed.');
  }
  if (!isReleaseVersion(npmVersion) ||
    !gte(npmVersion, PUBLICATION_POLICY.minimumNpmVersion)) {
    throw new Error(
      `Release verification requires npm >=${PUBLICATION_POLICY.minimumNpmVersion}.`,
    );
  }
}
