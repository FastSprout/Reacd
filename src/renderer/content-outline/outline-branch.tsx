import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { ContentNavigationItem } from '../../core/content-outline.js';
import { CONTENT_OUTLINE_DEFAULTS } from '../../core/content-outline.js';
import { TREE_POLICY } from '../../core/tree-policy.js';
import { treeExpansion } from '../../core/tree.js';
import { OutlineLink } from './outline-link.js';

interface OutlineBranchBase {
  item: ContentNavigationItem;
  level: number;
  currentKey?: string | undefined;
  onCurrentChange?: ((key: string) => boolean | void) | undefined;
  disabled?: boolean | undefined;
  expansionReadOnly?: boolean | undefined;
  report: (message: string) => void;
}
export type OutlineBranchProps = OutlineBranchBase &
  (
    | { mode: 'toc' }
    | {
        mode: 'navigation';
        expandedKeys: readonly string[];
        onExpandedKeysChange: (keys: readonly string[]) => void;
      }
  );

export function OutlineBranch({ item, ...props }: OutlineBranchProps) {
  const id = useId();
  const disabled = Boolean(props.disabled || item.disabled);
  const expanded = props.mode === 'toc' || props.expandedKeys.includes(item.key);
  const href = props.mode === 'toc' ? `#${item.key}` : item.href;
  const style: CSSProperties = {
    paddingInlineStart: `min(${
      (props.level - TREE_POLICY.initialLevel) * TREE_POLICY.indentRem
    }rem, ${TREE_POLICY.maxIndentPercent}%)`,
  };
  return (
    <li>
      <div className="reacd-content-outline-row" style={style}>
        {href === undefined ? (
          <span>{item.label}</span>
        ) : (
          <OutlineLink
            label={item.label}
            itemKey={item.key}
            href={href}
            newWindow={item.newWindow}
            disabled={disabled}
            current={props.currentKey === item.key}
            onCurrentChange={props.onCurrentChange}
            report={props.report}
          />
        )}
        {item.children !== undefined && props.mode === 'navigation' && (
          <button
            type="button"
            className="reacd-button reacd-content-disclosure"
            aria-label={`${
              expanded
                ? CONTENT_OUTLINE_DEFAULTS.collapseLabel
                : CONTENT_OUTLINE_DEFAULTS.expandLabel
            } ${item.label}`}
            aria-expanded={expanded}
            aria-controls={id}
            disabled={disabled || props.expansionReadOnly}
            onClick={() =>
              props.onExpandedKeysChange(treeExpansion(props.expandedKeys, item.key))
            }
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>
      {item.children !== undefined && (
        <ul id={id} hidden={!expanded}>
          {item.children.map((child) => (
            <OutlineBranch
              {...props}
              key={child.key}
              item={child}
              disabled={disabled}
              level={props.level + TREE_POLICY.initialLevel}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
