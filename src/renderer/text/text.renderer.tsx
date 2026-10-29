import { DEFAULTS } from '../../core/policy.js';
import type { TextProps } from '../../components/text/text.js';

export function TextSurface({ children, role, weight, lineLimit }: TextProps) {
  const logicalRole = role ?? DEFAULTS.textRole;
  const Tag =
    logicalRole === 'headline' ? 'h1' : logicalRole === 'subheadline' ? 'h2' : 'p';
  return (
    <div className="reacd-node reacd-text-block">
      <Tag
        className="reacd-text"
        data-role={logicalRole}
        data-weight={weight}
        data-clamped={lineLimit !== undefined}
        style={{ WebkitLineClamp: lineLimit }}
      >
        {children}
      </Tag>
      {lineLimit !== undefined && (
        <details className="reacd-full-text">
          <summary>Full text</summary>
          <p>{children}</p>
        </details>
      )}
    </div>
  );
}
