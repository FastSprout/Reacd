import type { TreeProps } from
  '@fastsprout/reacd/adapter-runtime/components/tree/tree.js';
import {
  TREE_DEFAULTS,
  TREE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/tree-policy.js';
import { Button } from '../vendor/ui/button.js';
import { useTree } from './use-tree.js';
import { focusTreeElement } from './focus-element.js';

export function ShadcnTree(properties: TreeProps) {
  const {
    label,
    value,
    expanded,
    multiple,
    disabled,
    selectionReadOnly,
    expansionReadOnly,
    emptyLabel = TREE_DEFAULTS.emptyLabel,
  } = properties;
  const tree = useTree(properties);
  return (
    <div
      className="reacd-node reacd-tree"
      data-slot="tree"
      role="tree"
      aria-label={label}
      aria-multiselectable={multiple}
      aria-disabled={disabled}
      aria-readonly={selectionReadOnly}
      data-direction={tree.direction}
      tabIndex={tree.focusId === undefined ? 0 : undefined}
    >
      {tree.rows.length === 0 && <p role="status">{emptyLabel}</p>}
      {tree.rows.map((row) => {
        const open = expanded.includes(row.id);
        return (
          <div
            className="reacd-tree-item"
            role="treeitem"
            key={row.id}
            aria-label={row.label}
            aria-level={row.level}
            aria-posinset={row.position}
            aria-setsize={row.size}
            aria-expanded={row.branch ? open : undefined}
            aria-selected={value.includes(row.id)}
            aria-disabled={disabled || row.disabled}
            tabIndex={tree.focusId === row.id ? 0 : -1}
            style={{
              paddingInlineStart: `min(${
                (row.level - TREE_POLICY.initialLevel) * TREE_POLICY.indentRem
              }rem, ${TREE_POLICY.maxIndentPercent}%)`,
            }}
            ref={(element) => {
              if (element === null) tree.elements.current.delete(row.id);
              else tree.elements.current.set(row.id, element);
            }}
            onFocus={() => tree.setFocused(row.id)}
            onClick={() => {
              focusTreeElement(tree.elements.current, row.id);
              tree.select(row);
            }}
            onKeyDown={(event) => tree.onKeyDown(event, row)}
          >
            {row.branch ? (
              <Button
                type="button"
                variant="ghost"
                tabIndex={-1}
                className="reacd-tree-toggle"
                aria-label={`${open ? 'Collapse' : 'Expand'} ${row.label}`}
                disabled={disabled || row.disabled || expansionReadOnly}
                onKeyDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  focusTreeElement(tree.elements.current, row.id);
                  tree.toggle(row);
                }}
              >
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </Button>
            ) : (
              <span aria-hidden="true" className="reacd-tree-spacer" />
            )}
            <span className="reacd-tree-label">{row.label}</span>
          </div>
        );
      })}
    </div>
  );
}
