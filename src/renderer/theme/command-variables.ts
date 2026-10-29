import { COMMAND_POLICY } from '../../core/command-policy.js';
export function commandVariables() {
  return {
    '--reacd-command-block': `${COMMAND_POLICY.listBlockRem}rem`,
    '--reacd-command-description': COMMAND_POLICY.descriptionScale,
  };
}
