import type { PanelConstraint, PanelShare } from '../../core/splitter.js';
import { collapsePair, pairBounds, resizePair } from '../../core/splitter.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';

export function splitterKey({
  key,
  shift,
  index,
  panels,
  value,
  orientation,
  direction,
  expanded,
}: {
  key: string;
  shift: boolean;
  index: number;
  panels: readonly PanelConstraint[];
  value: readonly PanelShare[];
  orientation: 'horizontal' | 'vertical';
  direction: 'ltr' | 'rtl';
  expanded: Map<string, number>;
}): readonly PanelShare[] | null {
  const primary = panels[index];
  const current = value[index];
  const bounds = pairBounds(panels, value, index);
  if (!primary || !current || !bounds) return null;
  const step = shift
    ? SPLITTER_POLICY.coarseKeyboardStep
    : SPLITTER_POLICY.keyboardStep;
  if (key === 'Enter' && primary.collapsedShare !== undefined) {
    if (current.share === primary.collapsedShare)
      return resizePair(
        panels,
        value,
        index,
        expanded.get(primary.id) ?? primary.minShare,
      );
    expanded.set(primary.id, current.share);
    return collapsePair(panels, value, index);
  }
  if (key === 'Home') return resizePair(panels, value, index, bounds.min);
  if (key === 'End') return resizePair(panels, value, index, bounds.max);
  const positive = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const negative = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  if (key !== positive && key !== negative) return null;
  const sign = orientation === 'horizontal' && direction === 'rtl' ? -1 : 1;
  return resizePair(
    panels,
    value,
    index,
    current.share + (key === positive ? step : -step) * sign,
  );
}
