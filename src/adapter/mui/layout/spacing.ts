import type { Theme } from '@mui/material/styles';
import {
  DEFAULTS,
  DESIGN_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import type { Spacing } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { templates } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';

export function materialSpacing(theme: Theme, spacing?: Spacing): string {
  const template = theme.reacd ?? templates[DESIGN_POLICY.defaultTemplate];
  return `${template.spacing[spacing ?? DEFAULTS.spacing]}rem`;
}
