import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/changelog-version/changelog-version.adapter.js';
import { SharedChangelogVersion } from
  '../../shared/changelog-version/changelog-version.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChangelogVersionProps = ComponentProps<typeof SharedChangelogVersion>;
export const ShadcnChangelogVersion: ComponentType<ShadcnChangelogVersionProps> =
  bindPrimitives(SharedChangelogVersion, shadcnPrimitives, 'ShadcnChangelogVersion');
