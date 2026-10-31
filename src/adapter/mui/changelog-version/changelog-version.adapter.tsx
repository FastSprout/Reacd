import type { ComponentProps, ComponentType } from 'react';
import { SharedChangelogVersion } from
  '../../shared/changelog-version/changelog-version.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChangelogVersionProps = ComponentProps<typeof SharedChangelogVersion>;
export const MuiChangelogVersion: ComponentType<MuiChangelogVersionProps> =
  bindPrimitives(SharedChangelogVersion, muiPrimitives, 'MuiChangelogVersion');
