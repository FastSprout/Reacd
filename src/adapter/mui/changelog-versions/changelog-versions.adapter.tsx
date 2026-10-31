import type { ComponentProps, ComponentType } from 'react';
import { SharedChangelogVersions } from
  '../../shared/changelog-versions/changelog-versions.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChangelogVersionsProps = ComponentProps<typeof SharedChangelogVersions>;
export const MuiChangelogVersions: ComponentType<MuiChangelogVersionsProps> =
  bindPrimitives(SharedChangelogVersions, muiPrimitives, 'MuiChangelogVersions');
