import { DASHBOARD_POLICY } from './dashboard-policy.js';
import type { PanelShare } from './splitter.js';

export function dashboardDisplayLayout(
  regions: readonly { id: string; kind: 'sidebar' | 'panel' }[],
  value: readonly PanelShare[],
  open: boolean,
  narrow: boolean,
  mode: 'offcanvas' | 'icon',
): readonly PanelShare[] {
  if (open && !narrow) return value;
  const index = regions.findIndex((region) => region.kind === 'sidebar');
  const sidebar = value[index];
  const adjacent = index + 1 < value.length ? index + 1 : index - 1;
  if (!sidebar || !value[adjacent]) return value;
  const collapsed =
    !narrow && mode === 'icon'
      ? Math.min(DASHBOARD_POLICY.iconShare, sidebar.share)
      : DASHBOARD_POLICY.zeroShare;
  const released = sidebar.share - collapsed;
  return value.map((item, position) => ({
    ...item,
    share:
      position === index
        ? collapsed
        : position === adjacent
          ? item.share + released
          : item.share,
  }));
}
