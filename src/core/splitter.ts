import { SPLITTER_POLICY } from './splitter-policy.js';

export interface PanelConstraint {
  readonly id: string;
  readonly minShare: number;
  readonly maxShare: number;
  readonly collapsedShare?: number | undefined;
}

export interface PanelShare {
  readonly id: string;
  readonly share: number;
}

export function validPanelRange(panel: PanelConstraint): boolean {
  return panel.minShare <= panel.maxShare;
}

export function validCollapsedShare(panel: PanelConstraint): boolean {
  return panel.collapsedShare === undefined || panel.collapsedShare < panel.minShare;
}

export function pairBounds(
  panels: readonly PanelConstraint[],
  value: readonly PanelShare[],
  index: number,
): { min: number; max: number } | null {
  const primary = panels[index];
  const secondary = panels[index + 1];
  const first = value[index];
  const second = value[index + 1];
  if (!primary || !secondary || !first || !second) return null;
  const total = first.share + second.share;
  return {
    min: Math.max(primary.minShare, total - secondary.maxShare),
    max: Math.min(primary.maxShare, total - secondary.minShare),
  };
}

export function resizePair(
  panels: readonly PanelConstraint[],
  value: readonly PanelShare[],
  index: number,
  requested: number,
): readonly PanelShare[] {
  const bounds = pairBounds(panels, value, index);
  const first = value[index];
  const second = value[index + 1];
  if (!bounds || !first || !second || !Number.isFinite(requested)) return value;
  if (bounds.min > bounds.max) return value;
  const rounded =
    Math.round(requested * SPLITTER_POLICY.precision) / SPLITTER_POLICY.precision;
  const share = Math.max(bounds.min, Math.min(bounds.max, rounded));
  return value.map((item, position) => {
    if (position === index) return { ...item, share };
    if (position === index + 1)
      return { ...item, share: first.share + second.share - share };
    return item;
  });
}

export function collapsePair(
  panels: readonly PanelConstraint[],
  value: readonly PanelShare[],
  index: number,
): readonly PanelShare[] {
  const primary = panels[index];
  const secondary = panels[index + 1];
  const first = value[index];
  const second = value[index + 1];
  if (
    !primary ||
    !secondary ||
    !first ||
    !second ||
    primary.collapsedShare === undefined
  )
    return value;
  const collapsed = primary.collapsedShare;
  const remaining = first.share + second.share - collapsed;
  if (remaining < secondary.minShare || remaining > secondary.maxShare) return value;
  return value.map((item, position) => {
    if (position === index) return { ...item, share: collapsed };
    if (position === index + 1) return { ...item, share: remaining };
    return item;
  });
}
