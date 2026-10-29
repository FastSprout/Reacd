import type { ReactNode } from 'react';
import type { PageFeatureProps }
  from '../../../components/page-feature/page-feature.props.js';
import { PageIntroduction }
  from '../../../renderer/page-introduction/page-introduction.js';
import { PAGE_PRESENTATION_DEFAULTS } from '../../../core/page-presentation-policy.js';

export function ShadcnPageFeature(props: PageFeatureProps): ReactNode {
  return (
    <PageIntroduction
      {...props}
      kind="feature"
      orientation={props.orientation ?? PAGE_PRESENTATION_DEFAULTS.featureOrientation}
    />
  );
}
