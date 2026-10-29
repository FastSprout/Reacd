import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import type { TreeProps } from '../../../components/tree/tree.js';
import type { TreeRow } from '../../../core/tree.js';
import { treeRows, treeSelection, treeExpansion } from '../../../core/tree.js';
import { treeFocusTarget, treeTypeahead } from '../../../core/tree-navigation.js';
import { TREE_DEFAULTS, TREE_POLICY } from '../../../core/tree-policy.js';
import { focusTreeElement } from './focus-element.js';

export function useTree({
  items,
  value,
  expanded,
  onValueChange,
  onExpandedChange,
  disabled = TREE_DEFAULTS.disabled,
  multiple = TREE_DEFAULTS.multiple,
  selectionReadOnly = TREE_DEFAULTS.selectionReadOnly,
  expansionReadOnly = TREE_DEFAULTS.expansionReadOnly,
}: TreeProps) {
  const direction = useDirection();
  const [focused, setFocused] = useState<string>();
  const elements = useRef(new Map<string, HTMLElement>());
  const typed = useRef({ query: '', time: 0 });
  const rows = treeRows(items, expanded);
  const enabled = disabled ? [] : rows.filter((row) => !row.disabled);
  const focusId = enabled.some((row) => row.id === focused)
    ? focused
    : (enabled.find((row) => value.includes(row.id))?.id ?? enabled[0]?.id);
  function select(row: TreeRow) {
    if (disabled || row.disabled || selectionReadOnly) return;
    onValueChange(treeSelection(value, row.id, multiple));
  }
  function toggle(row: TreeRow) {
    if (disabled || row.disabled || expansionReadOnly || !row.branch) return;
    onExpandedChange(treeExpansion(expanded, row.id));
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, row: TreeRow) {
    if (disabled || row.disabled || event.altKey || event.ctrlKey || event.metaKey)
      return;
    const target = treeFocusTarget(rows, row.id, event.key);
    if (target !== undefined) {
      event.preventDefault();
      focusTreeElement(elements.current, target);
      return;
    }
    const forward = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) {
      event.preventDefault();
      if (row.branch) {
        if (expanded.includes(row.id)) {
          focusTreeElement(
            elements.current,
            rows.find((item) => item.parent === row.id && !item.disabled)?.id,
          );
        } else toggle(row);
      }
      return;
    }
    if (event.key === backward) {
      event.preventDefault();
      if (row.branch && expanded.includes(row.id)) toggle(row);
      else focusTreeElement(elements.current, row.parent);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(row);
      return;
    }
    if (event.key.length === 1) {
      const time = Date.now();
      const query =
        time - typed.current.time > TREE_POLICY.typeaheadResetMs
          ? event.key
          : typed.current.query + event.key;
      const match = treeTypeahead(rows, row.id, query);
      typed.current = { time, query: match === undefined ? event.key : query };
      focusTreeElement(
        elements.current,
        match ?? treeTypeahead(rows, row.id, event.key),
      );
    }
  }
  return { rows, elements, focusId, setFocused, select, toggle, onKeyDown, direction };
}
