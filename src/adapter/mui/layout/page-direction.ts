import type { PageHeroProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-hero/page-hero.props.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';

export function materialPageDirection(props: Pick<PageHeroProps, 'orientation'>) {
  const orientation = props.orientation ?? PAGE_PRESENTATION_DEFAULTS.orientation;
  return orientation === 'horizontal' ? 'row' : 'column';
}
