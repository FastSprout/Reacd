import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/changelog-versions/changelog-versions.adapter.js';
import { SharedChangelogVersions } from
  '../../shared/changelog-versions/changelog-versions.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChangelogVersionsProps = ComponentProps<
  typeof SharedChangelogVersions
>;
export const ShadcnChangelogVersions: ComponentType<ShadcnChangelogVersionsProps> =
  bindPrimitives(SharedChangelogVersions, shadcnPrimitives, 'ShadcnChangelogVersions');
