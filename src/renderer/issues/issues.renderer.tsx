import type { ValidationIssue } from '../../core/render-port.js';

export function Issues({ issues }: { issues: readonly ValidationIssue[] }) {
  return (
    <div className="reacd-issues" role="alert">
      <strong>Unable to render this interface.</strong>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>
            <code>{issue.path}</code>: {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
