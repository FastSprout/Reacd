import { SOURCE_POLICY } from '../../src/core/policy.js';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';

export function checkSource(file: string, source: string): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const lines = source.replace(/\n$/, '').split('\n');
  if (lines.length > SOURCE_POLICY.maxLines) {
    issues.push(diagnostic(file, source, 0, 'lines', 'Split this module.'));
  }
  let offset = 0;
  for (const line of lines) {
    if (Array.from(line).length > SOURCE_POLICY.maxColumns) {
      issues.push(diagnostic(file, source, offset, 'columns', 'Wrap this line.'));
    }
    if (/^\s*\t/.test(line)) {
      issues.push(diagnostic(file, source, offset, 'tabs', 'Use spaces.'));
    }
    const indentation = line.search(/\S|$/);
    if (!file.endsWith('.md') && indentation % SOURCE_POLICY.indentation !== 0) {
      issues.push(diagnostic(file, source, offset, 'indent', 'Use two spaces.'));
    }
    offset += line.length + 1;
  }
  return issues;
}
