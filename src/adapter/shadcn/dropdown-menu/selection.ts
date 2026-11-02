import {
  ACTION_MENU_DEFAULTS,
  menuDecision,
} from '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';

export function selectMenuItem(
  event: Pick<Event, 'preventDefault'>,
  action: () => unknown,
  close: boolean,
  report: (message: string) => void,
) {
  const decision = menuDecision(action());
  if (decision !== 'accept') {
    event.preventDefault();
    report(
      decision === 'veto'
        ? ACTION_MENU_DEFAULTS.rejectedResult
        : ACTION_MENU_DEFAULTS.invalidResult,
    );
    return;
  }
  report('');
  if (!close) event.preventDefault();
}
