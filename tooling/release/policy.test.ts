import { describe, expect, it } from 'vitest';
import { isReleaseVersion } from './policy.js';

describe('canonical release versions', () => {
  it.each(['0.1.0', '1.0.0-rc.1', '1.0.0+build.42'])(
    'accepts valid SemVer %s',
    (value) => expect(isReleaseVersion(value)).toBe(true),
  );
  it.each([undefined, null, 1, '', 'v1.0.0', '1.0.0 ', '1.0', '01.0.0'])(
    'rejects malformed or prefixed version %j',
    (value) => expect(isReleaseVersion(value)).toBe(false),
  );
});
